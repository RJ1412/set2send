/**
 * Coins Service
 * Manages the S2S Coins ledger, balance caching, reservations, and redemptions.
 *
 * Rules:
 *  - Balance = SUM(delta) from coin_ledger — never a mutable balance column
 *  - Balance cached in Redis with 60s TTL, invalidated on every write
 *  - Coin reservations prevent double-spend across concurrent checkouts
 *  - 1 coin = ₹1
 */

import { prisma } from "../utils/db.js";
import { getRedis } from "../utils/redis.js";

const BALANCE_TTL = 60; // seconds
const COIN_REDEEM_MIN = 1000;
const LOCK_TTL = 30; // seconds for Redis lock

/** Redis key for a user's cached balance */
const balanceKey = (userId) => `s2s:coin_balance:${userId}`;
/** Redis key for checkout lock */
const lockKey = (userId) => `s2s:checkout_lock:${userId}`;

/**
 * Get user's current coin balance.
 * Reads from Redis cache if available, otherwise computes from ledger and caches result.
 */
export async function getUserBalance(userId) {
  const redis = getRedis();

  if (redis) {
    const cached = await redis.get(balanceKey(userId));
    if (cached !== null) return parseInt(cached, 10);
  }

  const result = await prisma.coinLedger.aggregate({
    where: { user_id: userId },
    _sum: { delta: true },
  });

  const balance = result._sum.delta ?? 0;

  if (redis) {
    await redis.set(balanceKey(userId), balance, "EX", BALANCE_TTL);
  }

  return balance;
}

/**
 * Invalidate cached balance for a user.
 * Called after every ledger write.
 */
async function invalidateBalanceCache(userId) {
  const redis = getRedis();
  if (redis) {
    await redis.del(balanceKey(userId));
  }
}

/**
 * Credit or debit coins and write a ledger entry.
 * Must be called inside a Prisma transaction when atomicity is needed.
 *
 * @param {string} userId
 * @param {number} delta - positive to credit, negative to debit
 * @param {string} reason - referral_bonus_referrer | referral_bonus_referee | applied_to_invoice | redeemed_cash | admin_adjustment
 * @param {string} [referenceId] - optional reference (order_id, referral_id, payout_id)
 * @param {object} [tx] - Prisma transaction client (optional)
 * @returns {object} the created CoinLedger row
 */
export async function creditCoins(userId, delta, reason, referenceId = null, tx = null) {
  const db = tx || prisma;

  // Compute current balance to calculate balance_after
  const current = await getUserBalance(userId);
  const balanceAfter = current + delta;

  if (balanceAfter < 0) {
    throw new Error(`Insufficient coin balance. Current: ${current}, Requested debit: ${Math.abs(delta)}`);
  }

  const entry = await db.coinLedger.create({
    data: {
      user_id: userId,
      delta,
      reason,
      reference_id: referenceId,
      balance_after: balanceAfter,
    },
  });

  // Invalidate cache after write
  await invalidateBalanceCache(userId);

  return entry;
}

/**
 * Reserve coins for a pending checkout order.
 * Acquires a Redis lock to prevent double-spend.
 * Returns null if lock cannot be acquired or insufficient balance.
 *
 * @param {string} userId
 * @param {string} orderId - Razorpay order_id
 * @param {number} coinAmount - coins to reserve
 * @param {number} expiresInSeconds - how long the reservation is valid
 */
export async function reserveCoins(userId, orderId, coinAmount, expiresInSeconds = 1800) {
  if (coinAmount <= 0) return { success: true, reservation: null };

  const redis = getRedis();
  const lock = lockKey(userId);

  // Try to acquire lock
  let lockAcquired = false;
  if (redis) {
    const result = await redis.set(lock, orderId, "EX", LOCK_TTL, "NX");
    lockAcquired = result === "OK";
    if (!lockAcquired) {
      return { success: false, error: "Another checkout is in progress. Please wait a moment." };
    }
  }

  try {
    const balance = await getUserBalance(userId);
    if (balance < coinAmount) {
      return { success: false, error: `Insufficient coins. Balance: ${balance}, Required: ${coinAmount}` };
    }

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const reservation = await prisma.coinReservation.upsert({
      where: { order_id: orderId },
      update: { coin_amount: coinAmount, status: "pending", expires_at: expiresAt },
      create: {
        user_id: userId,
        order_id: orderId,
        coin_amount: coinAmount,
        status: "pending",
        expires_at: expiresAt,
      },
    });

    return { success: true, reservation };
  } finally {
    // Release lock
    if (redis && lockAcquired) {
      const lockVal = await redis.get(lock);
      if (lockVal === orderId) await redis.del(lock);
    }
  }
}

/**
 * Finalize a coin reservation after payment succeeds.
 * Writes the actual ledger deduction and marks reservation as finalized.
 * Idempotent — safe to call multiple times for same orderId.
 */
export async function finalizeReservation(orderId, tx = null) {
  const db = tx || prisma;

  const reservation = await db.coinReservation.findUnique({
    where: { order_id: orderId },
  });

  if (!reservation || reservation.status !== "pending") {
    return null; // Already finalized or no reservation
  }

  // Write ledger entry
  const entry = await creditCoins(
    reservation.user_id,
    -reservation.coin_amount,
    "applied_to_invoice",
    orderId,
    db
  );

  // Mark reservation as finalized
  await db.coinReservation.update({
    where: { order_id: orderId },
    data: { status: "finalized" },
  });

  return entry;
}

/**
 * Release a coin reservation (payment failed/expired).
 * Coins are simply unreserved (no ledger entry since they were never deducted).
 */
export async function releaseReservation(orderId, tx = null) {
  const db = tx || prisma;

  const reservation = await db.coinReservation.findUnique({
    where: { order_id: orderId },
  });

  if (!reservation || reservation.status !== "pending") {
    return null;
  }

  await db.coinReservation.update({
    where: { order_id: orderId },
    data: { status: "released" },
  });

  return reservation;
}

/**
 * Create a payout (redemption) request.
 * Validates balance >= COIN_REDEEM_MIN, creates PayoutRequest, and immediately debits coins.
 * Atomic — done in a transaction to prevent double-redemption.
 *
 * @param {string} userId
 * @param {object} bankDetails - { account_number, ifsc, account_name, bank_name }
 * @returns {object} payout request
 */
export async function redeemCoins(userId, bankDetails) {
  const balance = await getUserBalance(userId);

  if (balance < COIN_REDEEM_MIN) {
    throw new Error(`Minimum ${COIN_REDEEM_MIN} coins required to redeem. Current balance: ${balance}`);
  }

  // Redeem full balance (all coins at once)
  const coinAmount = balance;
  const inrAmount = coinAmount; // 1 coin = ₹1

  return await prisma.$transaction(async (tx) => {
    // Create payout request
    const payoutRequest = await tx.payoutRequest.create({
      data: {
        user_id: userId,
        coin_amount: coinAmount,
        inr_amount: inrAmount,
        bank_details: JSON.stringify(bankDetails),
        status: "pending",
      },
    });

    // Immediately debit coins (prevents double-redemption)
    await creditCoins(userId, -coinAmount, "redeemed_cash", payoutRequest.id, tx);

    return payoutRequest;
  });
}

/**
 * Get ledger history for a user, newest first.
 */
export async function getLedgerHistory(userId, limit = 50, offset = 0) {
  return prisma.coinLedger.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    take: limit,
    skip: offset,
  });
}

/**
 * Admin: credit/debit coins with admin_adjustment reason.
 */
export async function adminAdjustCoins(userId, delta, adminUserId, note = "") {
  return creditCoins(userId, delta, "admin_adjustment", `admin:${adminUserId}:${note}`);
}
