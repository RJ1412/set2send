import { Worker } from "../utils/queueWrapper.js";
import { pollerConnection } from "../queues/silentRecheckQueue.js";
import { prisma } from "../utils/db.js";
import axios from "axios";
import { env } from "../config/env.js";
import { emitAnalyticsEvent } from "../utils/analytics.js";
import { publishDashboardStatsForCampaign } from "../services/dashboardStats.service.js";

const processSilentRecheck = async (job) => {
  console.log(`\n=============================================`);
  console.log(`[SilentRecheck] 🕵️‍♂️ Running background sweeper for pending follow gates...`);
  console.log(`=============================================\n`);

  // 1. Calculate 24-hour expiration window
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 2. Find ALL pending jobs with messaging_ig_id
  const pendingJobs = await prisma.followGateJob.findMany({
    where: {
      status: { in: ["pending_follow", "done_but_not_following"] },
      messaging_ig_id: { not: null },
      follow_prompt_sent_at: { gt: twentyFourHoursAgo }
    },
    include: { campaign: { include: { instagram_account: true } } }
  });

  if (pendingJobs.length === 0) {
    console.log(`[SilentRecheck] No eligible pending jobs found.`);
    return;
  }

  console.log(`[SilentRecheck] Found ${pendingJobs.length} eligible jobs to check.`);

  // 3. Process each job
  for (const pendingJob of pendingJobs) {
    const { id: jobId, messaging_ig_id, campaign, commenter_username } = pendingJob;
    const accessToken = campaign.instagram_account.access_token;

    try {
      // Check follow status
      const res = await axios.get(
        `https://graph.facebook.com/v25.0/${messaging_ig_id}?fields=is_user_follow_business&access_token=${accessToken}`
      );

      if (res.data && res.data.is_user_follow_business) {
        console.log(`[SilentRecheck] 🎉 User ${commenter_username} (${messaging_ig_id}) is now following! Sending link silently.`);
        
        // Deliver link silently
        let messageToSend = campaign.dm_template;
        const apiUrl = env.API_URL || "http://localhost:5000";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        messageToSend = messageToSend.replace(urlRegex, (match) => {
           return `${apiUrl}/r?c=${campaign.id}&u=${messaging_ig_id}&s=original&url=${encodeURIComponent(match)}`;
        });

        await axios.post(
          `https://graph.facebook.com/v25.0/me/messages`,
          { recipient: { id: messaging_ig_id }, message: { text: messageToSend } },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        await prisma.followGateJob.update({
          where: { id: jobId },
          data: { status: "delivered_silent", delivered_at: new Date() }
        });

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { follow_gate_count: { increment: 1 }, dms_sent: { increment: 1 } }
        });
                         await publishDashboardStatsForCampaign(campaign.id);

        await emitAnalyticsEvent(campaign.id, "silent_recheck_delivered", commenter_username);
      } else {
        console.log(`[SilentRecheck] ⏳ User ${commenter_username} is still not following. Will check again later.`);
      }
    } catch (err) {
      console.error(`[SilentRecheck] ❌ Failed to verify user ${commenter_username}:`, err.response?.data || err.message);
    }
  }
  
  console.log(`[SilentRecheck] Sweeper cycle completed.`);
};

export const silentRecheckWorker = new Worker("silent-recheck", processSilentRecheck, 
  { connection: pollerConnection }
);

silentRecheckWorker.on("completed", (job) => {
  // Silent success
});

silentRecheckWorker.on("failed", (job, err) => {
  console.error(`[SilentRecheck] 🚨 Background worker failed:`, err);
});

silentRecheckWorker.on("error", (err) => console.error("[Worker Error]", err.message));


