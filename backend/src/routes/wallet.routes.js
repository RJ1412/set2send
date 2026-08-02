import { Router } from "express";
import { applyReferralCode, getWallet, redeemCoins } from "../controllers/wallet.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getWallet);
router.post("/redeem", redeemCoins);
router.post("/referral/apply", applyReferralCode);

export default router;

