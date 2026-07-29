import express from "express";
import { createSubscription, webhook, currentPlan } from "../controllers/billing.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-subscription", requireAuth, createSubscription);
router.get("/current-plan", requireAuth, currentPlan);
// Webhook parses raw body in server.js
router.post("/webhook", webhook);

export default router;
