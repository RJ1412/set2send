import express from "express";
import { handleLinkClick } from "../controllers/tracking.controller.js";

const router = express.Router();

router.get("/", handleLinkClick);

export default router;
