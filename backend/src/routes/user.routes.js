import express from "express";
import { getMe, updateProfile, enable2FA } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/me", getMe);
router.patch("/profile", updateProfile);
router.patch("/2fa", enable2FA);

export default router;
