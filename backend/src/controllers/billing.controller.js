import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env.js";
import { prisma } from "../utils/db.js";

let razorpay = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

const PLAN_LIMITS = {
  free: 100,
  starter: 5000,
  growth: 999999, // unlimited practically
  agency: 9999999
};

const PLAN_IDS = {
  starter: "plan_starter_id_mock",
  growth: "plan_growth_id_mock",
  agency: "plan_agency_id_mock"
};

export const createSubscription = async (req, res, next) => {
  try {
    if (!razorpay) return res.status(500).json({ error: "Billing not configured" });

    const { plan } = req.body;
    if (!PLAN_IDS[plan]) return res.status(400).json({ error: "Invalid plan" });

    const subscription = await razorpay.subscriptions.create({
      plan_id: PLAN_IDS[plan],
      customer_notify: 1,
      total_count: 12,
    });

    res.json({ subscriptionId: subscription.id });
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
      .update(req.body) // raw body
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(403).send("Invalid signature");
    }
  }

  const body = JSON.parse(req.body.toString());

  // In a real implementation, we would extract the customer email or notes to map back to our user
  // For this MVP, we acknowledge the event
  console.log("Razorpay Webhook Received:", body.event);

  res.status(200).send("OK");
};

export const currentPlan = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { subscription: true }
    });

    res.json(user?.subscription || { plan: "free", dms_used_this_month: 0, dms_limit: 100 });
  } catch (err) {
    next(err);
  }
};
