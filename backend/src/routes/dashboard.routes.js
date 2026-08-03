import express from "express";
import { getPlatforms, getStats, streamStats, togglePlatform, getLeads, addTestLead } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/platforms", getPlatforms);
router.get("/stats", getStats);
router.get("/stats/stream", streamStats);
router.post("/platforms/toggle", togglePlatform);
router.get("/leads", getLeads);
router.post("/leads/test", addTestLead);

export default router;


