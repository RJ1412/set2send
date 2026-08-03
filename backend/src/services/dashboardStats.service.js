import { prisma } from "../utils/db.js";

const subscribers = new Map();

export async function getDashboardStats(userId) {
  const accounts = await prisma.instagramAccount.findMany({
    where: { user_id: userId },
    select: { id: true },
  });
  const accountIds = accounts.map((account) => account.id);
  if (accountIds.length === 0) return { dms_sent: 0 };

  const totals = await prisma.campaign.aggregate({
    where: { instagram_account_id: { in: accountIds } },
    _sum: { dms_sent: true },
  });
  return { dms_sent: totals._sum.dms_sent ?? 0 };
}

export function subscribeToDashboardStats(userId, response) {
  const userSubscribers = subscribers.get(userId) ?? new Set();
  userSubscribers.add(response);
  subscribers.set(userId, userSubscribers);

  return () => {
    userSubscribers.delete(response);
    if (userSubscribers.size === 0) subscribers.delete(userId);
  };
}

export async function publishDashboardStatsForCampaign(campaignId) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { instagram_account: { select: { user_id: true } } },
  });
  const userId = campaign?.instagram_account?.user_id;
  if (!userId) return;

  const userSubscribers = subscribers.get(userId);
  if (!userSubscribers?.size) return;

  const payload = `data: ${JSON.stringify(await getDashboardStats(userId))}\n\n`;
  for (const response of userSubscribers) response.write(payload);
}
