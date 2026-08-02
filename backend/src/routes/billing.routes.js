import express from "express";
import { createOrder, verifyPayment, webhook, currentPlan } from "../controllers/billing.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", requireAuth, createOrder);
router.post("/verify-payment", requireAuth, verifyPayment);
router.get("/current-plan", requireAuth, currentPlan);
// Webhook parses raw body in server.js
router.post("/webhook", webhook);

export default router;
