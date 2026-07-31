import { Router } from "express";
import { getPayoutRequests, updatePayoutRequest } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.js";

// Note: Ensure `requireAdmin` middleware exists or add a basic check
export const requireAdmin = async (req, res, next) => {
  try {
    const { prisma } = await import("../utils/db.js");
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.is_admin) return res.status(403).json({ error: "Admin access required" });
    next();
  } catch (err) {
    next(err);
  }
};

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/payout-requests", getPayoutRequests);
router.patch("/payout-requests/:id", updatePayoutRequest);

export default router;
