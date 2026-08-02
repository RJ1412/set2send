import { prisma } from "../utils/db.js";
import { REDEMPTION_MINIMUM } from "../config/plans.js";

export const getWallet = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { referral_code: true }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure they have a referral code
    let referralCode = user.referral_code;
    if (!referralCode) {
      const crypto = await import("crypto");
      referralCode = crypto.randomBytes(4).toString("hex");
      await prisma.user.update({
        where: { id: req.userId },
        data: { referral_code: referralCode }
      });
    }

    // Get ledger
    const ledger = await prisma.coinLedger.findMany({
      where: { user_id: req.userId },
      orderBy: { created_at: "desc" }
    });

    // Compute balance from ledger (more robust than tracking a mutable column)
    const balance = ledger.reduce((sum, entry) => sum + entry.delta, 0);

    // Get referrals
    const referrals = await prisma.referral.findMany({
      where: { referrer_id: req.userId },
      include: { referred_user: { select: { name: true } } },
      orderBy: { created_at: "desc" }
    });

    res.json({
      balance,
      redemptionMinimum: REDEMPTION_MINIMUM,
      ledger,
      referralCode,
      referrals: referrals.map(r => ({
        id: r.id,
        status: r.status,
        name: r.referred_user?.name || "Unknown",
        date: r.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const redeemCoins = async (req, res, next) => {
  try {
    const { bankDetails } = req.body;

    if (!bankDetails) {
      return res.status(400).json({ error: "Bank details required for redemption." });
    }

    // Calculate live balance inside a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      const ledger = await tx.coinLedger.findMany({
        where: { user_id: req.userId },
        orderBy: { created_at: "asc" }
      });

      const balance = ledger.reduce((sum, entry) => sum + entry.delta, 0);

      if (balance < REDEMPTION_MINIMUM) {
        throw new Error(`Minimum balance of ${REDEMPTION_MINIMUM} coins required for redemption.`);
      }

      // Check if there is an existing pending request to avoid spamming
      const pendingRequest = await tx.payoutRequest.findFirst({
        where: { user_id: req.userId, status: "pending" }
      });

      if (pendingRequest) {
         throw new Error("You already have a pending redemption request.");
      }

      const amountToRedeem = balance;
      const inrAmount = amountToRedeem * 1; // 1 coin = 1 INR

      const payoutReq = await tx.payoutRequest.create({
        data: {
          user_id: req.userId,
          coin_amount: amountToRedeem,
          inr_amount: inrAmount,
          bank_details: JSON.stringify(bankDetails),
          status: "pending"
        }
      });

      // Insert deduction into ledger immediately
      const newLedgerEntry = await tx.coinLedger.create({
        data: {
          user_id: req.userId,
          delta: -amountToRedeem,
          reason: "redeemed_cash",
          reference_id: payoutReq.id,
          balance_after: balance - amountToRedeem
        }
      });

      return { payoutReq, newLedgerEntry };
    });

    res.json({ success: true, payoutRequest: result.payoutReq });
  } catch (error) {
    if (error.message.includes("Minimum balance") || error.message.includes("pending redemption")) {
       return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};



export const applyReferralCode = async (req, res, next) => {
  try {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!code) return res.status(400).json({ error: "Referral code is required." });

    const [user, referrer, existingReferral] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, referred_by_code: true } }),
      prisma.user.findUnique({ where: { referral_code: code }, select: { id: true } }),
      prisma.referral.findUnique({ where: { referred_user_id: req.userId } }),
    ]);

    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.referred_by_code || existingReferral) return res.status(409).json({ error: "A referral code has already been applied to this account." });
    if (!referrer) return res.status(404).json({ error: "Referral code is invalid." });
    if (referrer.id === user.id) return res.status(400).json({ error: "You cannot use your own referral code." });

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { referred_by_code: code } }),
      prisma.referral.create({ data: { referrer_id: referrer.id, referred_user_id: user.id, status: "pending" } }),
    ]);

    res.status(201).json({ success: true, message: "Referral code applied. Rewards unlock after the first paid subscription." });
  } catch (error) {
    next(error);
  }
};
