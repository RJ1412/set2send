/**
 * Referral Service
 * Handles two-sided referral rewards for S2S Coins.
 *
 * Flow:
 *  1. At signup: new user enters referral code → createReferral() (status=pending)
 *  2. On first paid charge: processReferralReward() → credits both parties, status=rewarded
 *
 * Anti-fraud:
 *  - Block same-email self-referral (hard block)
 *  - Flag suspicious referrals (same IP/device) for manual review
 *  - Idempotent: guarded by referral.status + webhook event deduplication
 */

import { prisma } from "../utils/db.js";
import { creditCoins } from "./coins.service.js";
import { env } from "../config/env.js";

/**
 * Validate that a referral code exists and return the referrer user.
 * Returns null if code is invalid.
 */
export async function validateReferralCode(code) {
  if (!code || typeof code !== "string") return null;

  const referrer = await prisma.user.findUnique({
    where: { referral_code: code.trim() },
    select: { id: true, email: true, referral_code: true },
  });

  return referrer || null;
}

/**
 * Create a pending referral record at signup.
 * Does NOT grant any coins — only marks the relationship.
 *
 * @param {string} referrerId - the user who shared their code
 * @param {string} referredUserId - the new user who used the code
 * @param {string} [clientIp] - for fraud detection flagging
 * @returns {object} referral row
 */
export async function createReferral(referrerId, referredUserId, clientIp = null) {
  // Hard block: should be caught upstream, but double-check
  if (referrerId === referredUserId) {
    throw new Error("Self-referral is not allowed.");
  }

  // Create pending referral (upsert to be safe)
  const referral = await prisma.referral.upsert({
    where: { referred_user_id: referredUserId },
    update: {}, // Don't overwrite if already exists
    create: {
      referrer_id: referrerId,
      referred_user_id: referredUserId,
      status: "pending",
    },
  });

  return referral;
}

/**
 * Process referral reward when a referred user makes their FIRST paid subscription payment.
 * Idempotent — safe to call multiple times (e.g., on webhook retry).
 *
 * @param {string} referredUserId - the user who just paid
 * @param {string} paymentId - Razorpay payment/order ID (for reference)
 * @returns {object|null} { referral, referrerEntry, refereeEntry } or null if no reward to give
 */
export async function processReferralReward(referredUserId, paymentId) {
  // Find the pending referral for this user
  const referral = await prisma.referral.findUnique({
    where: { referred_user_id: referredUserId },
    include: {
      referrer: { select: { id: true, email: true } },
      referred_user: { select: { id: true, email: true } },
    },
  });

  if (!referral) return null; // No referral relationship
  if (referral.status !== "pending") return null; // Already rewarded or flagged — idempotent guard

  const REFERRER_BONUS = parseInt(env.REFERRER_BONUS, 10) || 500;
  const REFEREE_BONUS = parseInt(env.REFEREE_BONUS, 10) || 500;

  // Execute in a transaction for atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Mark referral as converted first (optimistic lock)
    const updated = await tx.referral.updateMany({
      where: { id: referral.id, status: "pending" },
      data: {
        status: "rewarded",
        converted_at: new Date(),
      },
    });

    // If 0 rows updated, another process already handled this — skip
    if (updated.count === 0) return null;

    // Credit REFERREE (the new user who subscribed)
    const refereeEntry = await creditCoins(
      referredUserId,
      REFEREE_BONUS,
      "referral_bonus_referee",
      referral.id,
      tx
    );

    // Credit REFERRER (the person who shared the code)
    const referrerEntry = await creditCoins(
      referral.referrer_id,
      REFERRER_BONUS,
      "referral_bonus_referrer",
      referral.id,
      tx
    );

    // Store ledger entry IDs on the referral for audit
    await tx.referral.update({
      where: { id: referral.id },
      data: {
        reward_txn_referrer_id: referrerEntry.id,
        reward_txn_referee_id: refereeEntry.id,
      },
    });

    return { referral, referrerEntry, refereeEntry };
  });

  return result;
}

/**
 * Flag a suspicious referral for manual admin review.
 * Does NOT auto-reject — holds the reward in pending.
 */
export async function flagReferral(referredUserId, reason) {
  return prisma.referral.updateMany({
    where: { referred_user_id: referredUserId, status: "pending" },
    data: { status: "flagged", flagged_reason: reason },
  });
}

/**
 * Get all referrals made by a user (their referral tree).
 */
export async function getUserReferrals(userId) {
  return prisma.referral.findMany({
    where: { referrer_id: userId },
    include: {
      referred_user: {
        select: { id: true, email: true, created_at: true },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

