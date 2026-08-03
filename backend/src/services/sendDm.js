/**
 * sendDm.js -- Sends a DM immediately without going through the BullMQ queue.
 * Used directly from the webhook handler for story mentions and real-time triggers.
 */
import axios from "axios";
import { prisma } from "../utils/db.js";
import { env } from "../config/env.js";
import { emitAnalyticsEvent } from "../utils/analytics.js";
import { publishDashboardStatsForCampaign } from "../services/dashboardStats.service.js";
import { getUserEntitlements } from "./entitlement.service.js";

export const sendCampaignDm = async ({ campaignId, commenterIgId, commenterUsername, commentText, commentId }) => {
  console.log(`[DirectDM] Sending DM for campaign ${campaignId} to ${commenterUsername}`);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { instagram_account: true },
  });

  if (!campaign || campaign.status !== "active") {
    console.log(`[DirectDM] Campaign ${campaignId} not found or not active.`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: campaign.instagram_account.user_id },
    include: { subscription: true },
  });

  const entitlements = await getUserEntitlements(campaign.instagram_account.user_id);
  if (entitlements.dm_limit !== null) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const sentThisMonth = await prisma.dmLog.count({
      where: { campaign: { instagram_account: { user_id: campaign.instagram_account.user_id } }, dm_status: "sent", dm_sent_at: { gte: startOfMonth } },
    });
    if (sentThisMonth >= entitlements.dm_limit) {
      console.log(`[DirectDM] DM limit reached for user ${user?.id}`);
      return;
    }
  }

  const previousDms = await prisma.dmLog.findMany({
    where: { campaign_id: campaignId, commenter_ig_id: commenterIgId, dm_status: "sent" },
    orderBy: { dm_sent_at: "desc" }
  });

  let messageToSend = campaign.dm_template;

  if (previousDms.length > 0) {
    if (campaign.retrigger_mode === "never") {
      console.log(`[DirectDM] User ${commenterIgId} already received DM. Mode: never.`);
      return;
    } else if (campaign.retrigger_mode === "after_days") {
      const daysSinceLast = (new Date() - new Date(previousDms[0].dm_sent_at)) / (1000 * 60 * 60 * 24);
      if (daysSinceLast < (campaign.retrigger_days || 1)) {
        console.log(`[DirectDM] Re-trigger blocked.`);
        return;
      }
    }
    if (campaign.returning_dm_template) {
      messageToSend = campaign.returning_dm_template;
    }
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const apiUrl = env.API_URL || "http://localhost:5000";
  messageToSend = messageToSend.replace(urlRegex, (match) => {
    return `${apiUrl}/r?c=${campaignId}&u=${commenterIgId}&s=original&url=${encodeURIComponent(match)}`;
  });

  const accessToken = campaign.instagram_account.access_token;
  let dmStatus = "sent";
  let errorMessage = null;

  try {
    const recipientPayload = campaign.trigger_type === "story_mention"
      ? { id: commenterIgId }
      : { comment_id: commentId };

    await axios.post(
      `https://graph.facebook.com/v25.0/me/messages`,
      { recipient: recipientPayload, message: { text: messageToSend } },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    console.log(`[DirectDM] DM sent to ${commenterUsername}`);
  } catch (err) {
    dmStatus = "failed";
    errorMessage = err.response?.data?.error?.message || err.message;
    console.error(`[DirectDM] Failed to send DM:`, errorMessage);
  }

  await prisma.dmLog.create({
    data: {
      campaign_id: campaignId,
      commenter_ig_id: commenterIgId,
      commenter_username: commenterUsername,
      comment_text: commentText,
      comment_id: commentId,
      dm_status: dmStatus,
      error_message: errorMessage,
      commented_at: new Date(),
      dm_sent_at: dmStatus === "sent" ? new Date() : null,
    },
  });

  if (dmStatus === "sent") {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { dms_sent: { increment: 1 } },
    });
        await publishDashboardStatsForCampaign(campaignId);
    await emitAnalyticsEvent(campaignId, "dm_sent", commenterUsername);
  }
};


