import { Worker } from "../utils/queueWrapper.js";
import { pollerConnection } from "../queues/dmPollerQueue.js";
import { prisma } from "../utils/db.js";
import axios from "axios";
import { env } from "../config/env.js";
import { emitAnalyticsEvent } from "../utils/analytics.js";
import { redis } from "../utils/redis.js";

const fallbackCache = new Map();

export const processDmPolling = async (job) => {
  console.log(`[DMPoller] Starting inbox polling cycle...`);

  // 1. Get all active instagram accounts
  const igAccounts = await prisma.instagramAccount.findMany({
    where: { status: 'active' }
  });

  if (igAccounts.length === 0) {
    console.log(`[DMPoller] No active Instagram accounts found.`);
    return;
  }

  for (const account of igAccounts) {
    try {
      // 2. Fetch conversations and messages
      const res = await axios.get(
        `https://graph.facebook.com/v25.0/me/conversations`,
        {
          params: {
            platform: 'instagram',
            access_token: account.access_token,
            fields: 'participants,messages{message,created_time,from}'
          }
        }
      );

      const conversations = res.data?.data || [];
      
      for (const conv of conversations) {
        const messages = conv.messages?.data || [];
        // Sort messages by created_time ascending (process oldest first)
        const sortedMessages = messages.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));

        for (const msg of sortedMessages) {
          const senderId = msg.from?.id;
          const username = msg.from?.username;
          const messageId = msg.id;
          const messageText = msg.message || "";

          // Skip if sent by the influencer
          if (senderId === account.ig_user_id) continue;

          // Check if message is DONE
          const isDoneReply = messageText.toLowerCase().trim() === "done";
          if (!isDoneReply) continue;

          // Check Redis to prevent duplicate processing
          const cacheKey = `processed_dm:${messageId}`;
          let alreadyProcessed = false;
          try {
            alreadyProcessed = await redis.get(cacheKey);
          } catch (err) {
            alreadyProcessed = fallbackCache.has(cacheKey);
          }
          if (alreadyProcessed) continue;

          console.log(`[DMPoller] 📥 Found new DONE reply from ${username} (${senderId})`);

          // Execute Webhook Logic
          const pendingJobs = await prisma.followGateJob.findMany({
            where: { 
              status: { in: ['pending_follow', 'done_but_not_following'] },
              messaging_ig_id: senderId
            },
            include: { campaign: true }
          });

          // Also check by username if messaging_ig_id wasn't saved yet
          if (pendingJobs.length === 0 && username) {
            const fallbackJobs = await prisma.followGateJob.findMany({
              where: {
                status: { in: ['pending_follow', 'done_but_not_following'] },
                commenter_username: username
              },
              include: { campaign: true }
            });
            pendingJobs.push(...fallbackJobs);
          }

          if (pendingJobs.length > 0) {
            // Verify follow status
            let isFollowing = false;
            try {
              const checkRes = await axios.get(
                `https://graph.facebook.com/v25.0/${senderId}?fields=is_user_follow_business&access_token=${account.access_token}`
              );
              if (checkRes.data && checkRes.data.is_user_follow_business) {
                isFollowing = true;
              }
            } catch (err) {
              console.error(`[DMPoller] Failed to check follow status for ${username}:`, err.response?.data || err.message);
            }

            for (const pJob of pendingJobs) {
              if (isFollowing) {
                // Deliver link
                let messageToSend = pJob.campaign.dm_template;
                const apiUrl = env.API_URL || "http://localhost:5000";
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                messageToSend = messageToSend.replace(urlRegex, (match) => {
                   return `${apiUrl}/r?c=${pJob.campaign_id}&u=${senderId}&s=original&url=${encodeURIComponent(match)}`;
                });

                await axios.post(
                  `https://graph.facebook.com/v25.0/me/messages`,
                  { recipient: { id: senderId }, message: { text: messageToSend } },
                  { headers: { Authorization: `Bearer ${account.access_token}` } }
                );

                await prisma.followGateJob.update({
                  where: { id: pJob.id },
                  data: { status: "delivered", delivered_at: new Date(), messaging_ig_id: senderId }
                });
                
                await prisma.campaign.update({
                  where: { id: pJob.campaign_id },
                  data: { follow_gate_count: { increment: 1 }, dms_sent: { increment: 1 } }
                });

                await emitAnalyticsEvent(pJob.campaign_id, "done_received_following", username);
                await emitAnalyticsEvent(pJob.campaign_id, "link_delivered", username);
                console.log(`[DMPoller] ✅ Delivered link to ${username}`);
              } else {
                // Not following
                const defaultMsg = `Looks like you haven't followed yet!\nFollow @${account.ig_username} and you're all set.`;
                const customMsg = pJob.campaign.not_following_message;
                
                await axios.post(
                    `https://graph.facebook.com/v25.0/me/messages`,
                    { recipient: { id: senderId }, message: { text: customMsg || defaultMsg } },
                    { headers: { Authorization: `Bearer ${account.access_token}` } }
                );
                
                await prisma.followGateJob.update({
                  where: { id: pJob.id },
                  data: { status: "done_but_not_following", messaging_ig_id: senderId }
                });

                await emitAnalyticsEvent(pJob.campaign_id, "done_received_not_following", username);
                console.log(`[DMPoller] ⏳ ${username} replied DONE but isn't following.`);
              }
            }
          }

          // Mark as processed in Redis (expire after 7 days)
          try {
            await redis.set(cacheKey, "true", "EX", 604800);
          } catch (err) {
            fallbackCache.set(cacheKey, { expires: Date.now() + 604800000 });
            if (fallbackCache.size > 10000) {
               const now = Date.now();
               for (const [k, v] of fallbackCache.entries()) {
                 if (now > v.expires) fallbackCache.delete(k);
               }
            }
          }
        }
      }
    } catch (err) {
      console.error(`[DMPoller] Error checking DMs for account ${account.ig_username}:`, err.response?.data || err.message);
    }
  }

  console.log(`[DMPoller] Cycle completed successfully.`);
};

export const dmPollerWorker = new Worker(
  "dm-poller",
  processDmPolling,
  { connection: pollerConnection }
);

dmPollerWorker.on("completed", (job) => {
  // Silent success
});

dmPollerWorker.on("failed", (job, err) => {
  console.error(`[DMPoller] Background worker failed:`, err);
});

dmPollerWorker.on("error", (err) => console.error("[Worker Error]", err.message));
