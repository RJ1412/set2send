import { prisma } from "../utils/db.js";

export const getPayoutRequests = async (req, res, next) => {
  try {
    const requests = await prisma.payoutRequest.findMany({
      include: {
        user: { select: { email: true, name: true } }
      },
      orderBy: { requested_at: "desc" }
    });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const updatePayoutRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    if (!["approved", "rejected", "paid"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const request = await prisma.payoutRequest.findUnique({
      where: { id }
    });

    if (!request) return res.status(404).json({ error: "Request not found." });

    if (request.status !== "pending" && status !== "paid") {
       return res.status(400).json({ error: "Cannot transition from " + request.status + " to " + status });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.payoutRequest.update({
        where: { id },
        data: {
          status,
          admin_note,
          processed_at: new Date(),
          processed_by: req.userId
        }
      });

      // If rejected, refund the coins
      if (status === "rejected") {
        const ledger = await tx.coinLedger.findMany({
          where: { user_id: request.user_id },
          orderBy: { created_at: "asc" }
        });
        const currentBalance = ledger.reduce((sum, entry) => sum + entry.delta, 0);

        await tx.coinLedger.create({
          data: {
            user_id: request.user_id,
            delta: request.coin_amount,
            reason: "admin_adjustment",
            reference_id: request.id,
            balance_after: currentBalance + request.coin_amount
          }
        });
      }

      return updated;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
