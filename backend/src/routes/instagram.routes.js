import express from "express";
import { connect, disconnect, health, getAccounts, exchangeToken } from "../controllers/instagram.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getAccounts);
router.get("/connect", requireAuth, connect);
router.delete("/:accountId/disconnect", requireAuth, disconnect);
router.get("/:accountId/health", requireAuth, health);
router.post("/", exchangeToken);

export default router;
