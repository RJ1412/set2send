import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env.js";
import { prisma } from "../utils/db.js";
import { computeInvoice, REFEREE_BONUS, REFERRER_BONUS } from "../config/plans.js";

let razorpay = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export const createOrder = async (req, res, next) => {
  try {
    const { plan, billing = "monthly", addons = [], extra_ig = 0, extra_wa = 0, wa_usage_estimate = 0, use_coins = false } = req.body;

    let coins_to_apply = 0;
    if (use_coins) {
       const ledger = await prisma.coinLedger.findMany({
         where: { user_id: req.userId },
         orderBy: { created_at: "asc" }
       });
       coins_to_apply = ledger.reduce((sum, entry) => sum + entry.delta, 0);
    }

    const invoice = computeInvoice({
      plan_key: plan,
      billing,
      addons,
      extra_ig,
      extra_wa,
      wa_usage_estimate,
      coins_to_apply
    });

    let orderId = `mock_order_${Date.now()}`;
    
    if (razorpay && invoice.total_paise > 0) {
      if (invoice.total_paise < 100) {
        return res.status(400).json({ error: "Minimum payable amount is ₹1 (100 paise)" });
      }
      const order = await razorpay.orders.create({
        amount: invoice.total_paise,
        currency: "INR",
        receipt: `receipt_${req.userId}_${Date.now()}`,
        notes: {
          user_id: req.userId,
          plan_key: plan,
        },
      });
      orderId = order.id;
    }

    // Reserve coins if applied
    if (invoice.coins_applied > 0) {
       await prisma.coinReservation.create({
         data: {
           user_id: req.userId,
           order_id: orderId,
           coin_amount: invoice.coins_applied,
           status: "pending",
           expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry
         }
       });
    }

    res.json({
      orderId,
      invoice
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    if (!env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Payment verification not configured" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed — signature mismatch" });
    }

    // Signature verified — activate the user's subscription
    const order = razorpay
      ? await razorpay.orders.fetch(razorpay_order_id)
      : null;

    if (order && order.notes?.user_id) {
      await prisma.subscription.upsert({
        where: { user_id: order.notes.user_id },
        update: {
          status: "active",
          plan_key: order.notes.plan_key || "creator",
          first_paid_at: new Date(),
        },
        create: {
          user_id: order.notes.user_id,
          plan: "creator",
          plan_key: order.notes.plan_key || "creator",
          status: "active",
          first_paid_at: new Date(),
        },
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req, res) => {
  const secret = env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body) 
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(403).send("Invalid signature");
    }
  }

  const body = JSON.parse(req.body.toString());
  const event = body.event;
  const eventId = req.headers["x-razorpay-event-id"] || body.event_id || `evt_${Date.now()}`;
  
  // Dedupe
  try {
    const existing = await prisma.webhookEvent.findUnique({ where: { event_id: eventId } });
    if (existing) return res.status(200).send("Already processed");
    await prisma.webhookEvent.create({ data: { event_id: eventId, event_type: event } });
  } catch (e) {
    // skip
  }

  if (event === "payment.captured" || event === "order.paid") {
    const entity = body.payload.payment?.entity || body.payload.order?.entity;
    const orderId = entity.order_id || entity.id;
    
    // We need user context. Usually passed via notes. 
    // Here we will try to find a reservation to get user_id, or assume it's passed in notes.
    const userId = entity.notes?.user_id;

    if (userId) {
       // Activate subscription
       await prisma.subscription.upsert({
         where: { user_id: userId },
         update: { 
            status: "active",
            plan_key: entity.notes?.plan_key || "creator",
            first_paid_at: new Date()
         },
         create: {
            user_id: userId,
            plan: "creator",
            plan_key: entity.notes?.plan_key || "creator",
            status: "active",
            first_paid_at: new Date()
         }
       });

       // Finalize reserved coins
       const reservation = await prisma.coinReservation.findUnique({ where: { order_id: orderId } });
       if (reservation && reservation.status === "pending") {
          await prisma.$transaction(async (tx) => {
             await tx.coinReservation.update({
               where: { id: reservation.id },
               data: { status: "finalized" }
             });

             const ledger = await tx.coinLedger.findMany({
               where: { user_id: userId },
               orderBy: { created_at: "asc" }
             });
             const balance = ledger.reduce((sum, entry) => sum + entry.delta, 0);

             await tx.coinLedger.create({
                data: {
                  user_id: userId,
                  delta: -reservation.coin_amount,
                  reason: "applied_to_invoice",
                  reference_id: orderId,
                  balance_after: balance - reservation.coin_amount
                }
             });
          });
       }

       // Handle referral rewards
       const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
       if (user.referred_by_code) {
          const referral = await prisma.referral.findUnique({ where: { referred_user_id: userId } });
          if (referral && referral.status === "pending") {
             // Reward both
             await prisma.$transaction(async (tx) => {
               await tx.referral.update({
                 where: { id: referral.id },
                 data: { status: "rewarded", converted_at: new Date() }
               });
               
               // Referrer reward
               const referrerLedger = await tx.coinLedger.findMany({
                 where: { user_id: referral.referrer_id },
                 orderBy: { created_at: "asc" }
               });
               const referrerBalance = referrerLedger.reduce((sum, entry) => sum + entry.delta, 0);
               await tx.coinLedger.create({
                 data: {
                   user_id: referral.referrer_id,
                   delta: REFERRER_BONUS,
                   reason: "referral_bonus_referrer",
                   reference_id: referral.id,
                   balance_after: referrerBalance + REFERRER_BONUS
                 }
               });

               // Referee reward
               const refereeLedger = await tx.coinLedger.findMany({
                 where: { user_id: userId },
                 orderBy: { created_at: "asc" }
               });
               const refereeBalance = refereeLedger.reduce((sum, entry) => sum + entry.delta, 0);
               await tx.coinLedger.create({
                 data: {
                   user_id: userId,
                   delta: REFEREE_BONUS,
                   reason: "referral_bonus_referee",
                   reference_id: referral.id,
                   balance_after: refereeBalance + REFEREE_BONUS
                 }
               });
             });
          }
       }
    }
  } else if (event === "payment.failed" || event === "order.failed") {
    const entity = body.payload.payment?.entity || body.payload.order?.entity;
    const orderId = entity.order_id || entity.id;
    
    // Release coins
    const reservation = await prisma.coinReservation.findUnique({ where: { order_id: orderId } });
    if (reservation && reservation.status === "pending") {
      await prisma.coinReservation.update({
        where: { id: reservation.id },
        data: { status: "released" }
      });
    }
  }

  res.status(200).send("OK");
};

export const currentPlan = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { subscription: true }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const dmsUsedCount = await prisma.dmLog.count({
      where: {
        campaign: { 
          instagram_account: {
            user_id: req.userId 
          }
        },
        dm_status: "sent",
        dm_sent_at: { gte: startOfMonth }
      }
    });

    const response = {
      ...(user?.subscription || { plan: "free" }),
      dms_used_this_month: dmsUsedCount,
      dms_limit: "Unlimited" // Handled properly in frontend now
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
};
