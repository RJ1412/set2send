import { Router } from "express";
import { getWallet, redeemCoins } from "../controllers/wallet.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getWallet);
router.post("/redeem", redeemCoins);

export default router;
