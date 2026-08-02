import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireFeature } from "../services/entitlement.service.js";
import {
  parseCsv,
  createCampaign,
  getCampaigns,
  getCampaign,
  getCampaignLogs,
  sendCampaign,
  verifyWebhook,
  handleWebhook,
  getTemplates,
  deleteCampaign,
} from "../controllers/whatsapp.controller.js";

const router = express.Router();

// Public webhook routes (Meta sends these without our JWT)
router.get("/webhook", verifyWebhook);
router.post("/webhook", handleWebhook);

// Protected routes
router.use(requireAuth);
router.use(requireFeature("wa"));

router.post("/parse-csv", parseCsv);
router.post("/campaigns", createCampaign);
router.get("/campaigns", getCampaigns);
router.get("/templates", getTemplates);
router.get("/campaigns/:id", getCampaign);
router.get("/campaigns/:id/logs", getCampaignLogs);
router.post("/campaigns/:id/send", sendCampaign);
router.delete("/campaigns/:id", deleteCampaign);

export default router;
