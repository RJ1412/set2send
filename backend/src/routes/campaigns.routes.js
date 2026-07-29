import express from "express";
import { getCampaigns, createCampaign, getCampaign, updateCampaign, deleteCampaign, getCampaignLogs, getCampaignEmails } from "../controllers/campaigns.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getCampaigns);
router.post("/", createCampaign);
router.get("/:id", getCampaign);
router.patch("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);
router.get("/:id/logs", getCampaignLogs);
router.get("/:id/emails", getCampaignEmails);

export default router;
