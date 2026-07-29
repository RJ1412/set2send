import express from "express";
import { verifyMetaWebhook, handleMetaEvent } from "../controllers/webhook.controller.js";

const router = express.Router();

router.get("/meta", verifyMetaWebhook);
// Using express.raw() in server.js to parse body for signature verification
router.post("/meta", handleMetaEvent);

export default router;
