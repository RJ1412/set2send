import { Worker } from "../utils/queueWrapper.js";
import { queueConnection } from "../queues/dmQueue.js";
import { prisma } from "../utils/db.js";
import axios from "axios";
import { pollerConnection } from "../queues/commentPollerQueue.js";
import { env } from "../config/env.js";
import { addFollowUpJob } from "../queues/followUpQueue.js";
import { emitAnalyticsEvent } from "../utils/analytics.js";

export const processDm = async (job) => {
  console.log(`[Queue] Processing job:`, job.data);
  const { campaignId, commenterIgId, commenterUsername, commentText, commentId } = job.data;
  
  // 1. Fetch Campaign Details
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { instagram_account: true },
  });

  if (!campaign || campaign.status !== "active") {
    console.log(`[Queue] Campaign ${campaignId} not found or not active.`);
    return;
  }

  // 2. Fetch User Subscription Limits
  const user = await prisma.user.findUnique({
    where: { id: campaign.instagram_account.user_id },
    include: { subscription: true },
  });

  if (!user?.subscription || user.subscription.dms_used_this_month >= user.subscription.dms_limit) {
    console.log(`[Queue] Limit reached for user ${user?.id}`);
    throw new Error("DM limit reached");
  }

  // 3. Match Keyword or Trigger Type
  let isMatch = false;
  if (campaign.trigger_type === 'story_mention') {
    isMatch = true; // Webhook already validated the mention
  } else {
    const keyword = campaign.keyword.toLowerCase().trim();
    const text = commentText.toLowerCase();
    const cleanText = text.replace(/[.,!?()[\]{}"']/g, ' ');
    isMatch = campaign.fuzzy_match 
      ? text.includes(keyword) 
      : cleanText.split(/\s+/).includes(keyword);
  }

  if (!isMatch) {
    console.log(`[Queue] Keyword did not match comment '${commentText}'.`);
    return; // Ignore, not a match
  }
  
  console.log(`[Queue] Keyword matched! Sending DM for campaign ${campaignId}...`);

  // Analytics: follow_gate_triggered
  if (campaign.require_follow) {
    await emitAnalyticsEvent(campaignId, "follow_gate_triggered", commenterUsername);
  }

  // Re-trigger Logic
  const previousDms = await prisma.dmLog.findMany({
    where: { campaign_id: campaignId, commenter_ig_id: commenterIgId, dm_status: "sent" },
    orderBy: { dm_sent_at: "desc" }
  });

  let messageToSend = campaign.dm_template;
  let isGateMessage = false;

  if (previousDms.length > 0) {
    if (campaign.retrigger_mode === "never") {
      console.log(`[Queue] User ${commenterIgId} already received DM. Mode: never.`);
      return;
    } else if (campaign.retrigger_mode === "after_days") {
      const daysSinceLast = (new Date() - new Date(previousDms[0].dm_sent_at)) / (1000 * 60 * 60 * 24);
      if (daysSinceLast < (campaign.retrigger_days || 1)) {
        console.log(`[Queue] User ${commenterIgId} re-trigger blocked. Days since last: ${daysSinceLast}`);
        return;
      }
    }
    // "always" or condition passed
    if (campaign.returning_dm_template) {
      messageToSend = campaign.returning_dm_template;
    }
  }

  // Follow Gate Logic
  const accessToken = campaign.instagram_account.access_token;
  let followGateJobId = null;

  if (campaign.require_follow) {
    // 1. Check if we have their IGSID in the database (Smart Memory)
    const existingContact = await prisma.instagramContact.findFirst({
      where: {
        username: commenterUsername,
        instagram_account_id: campaign.instagram_account.id
      }
    });

    let isFollowing = false;
    let messagingIgId = null;

    if (existingContact) {
      messagingIgId = existingContact.messaging_ig_id;
      try {
        const checkRes = await axios.get(
          `https://graph.facebook.com/v25.0/${messagingIgId}?fields=is_user_follow_business&access_token=${accessToken}`
        );
        if (checkRes.data && checkRes.data.is_user_follow_business) {
          isFollowing = true;
        }
      } catch (err) {
        console.error(`[Queue] Smart Memory check failed for ${commenterUsername}:`, err.response?.data || err.message);
      }
    }

    if (!isFollowing) {
      // Enforce the gate
      messageToSend = `Hey ${commenterUsername}! 👋\nTo get the link, just:\n1️⃣ Follow @${campaign.instagram_account.ig_username}\n2️⃣ Reply DONE to this message\n\nIf you've already followed, just reply DONE and I'll send it over!`;
      isGateMessage = true;

      const fgJob = await prisma.followGateJob.create({
        data: {
          campaign_id: campaignId,
          commenter_ig_id: commenterIgId,
          commenter_username: commenterUsername,
          comment_text: commentText,
          comment_id: commentId,
          messaging_ig_id: messagingIgId, // null if unknown, populated if known
          status: "pending_follow",
          follow_prompt_sent_at: new Date()
        }
      });
      followGateJobId = fgJob.id;
      console.log(`[Queue] User ${commenterUsername} gate locked. Messaging IG ID known: ${!!messagingIgId}`);
      
      await emitAnalyticsEvent(campaignId, "follow_prompt_sent", commenterUsername);
      // The silentRecheckWorker will automatically pick this up on its 60-second cycle
      if (messagingIgId) {
        console.log(`[Queue] User ${commenterUsername} gate locked. Silent recheck poller will monitor them.`);
      }
    } else {
      console.log(`[Queue] Smart Memory bypassed gate for ${commenterUsername} (Already following)`);
      await emitAnalyticsEvent(campaignId, "smart_memory_hit", commenterUsername);
      await emitAnalyticsEvent(campaignId, "link_delivered", commenterUsername);
    }
  }

  // Link Tracking
  if (!isGateMessage) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const apiUrl = env.API_URL || "http://localhost:5000";
    messageToSend = messageToSend.replace(urlRegex, (match) => {
       return `${apiUrl}/r?c=${campaignId}&u=${commenterIgId}&s=original&url=${encodeURIComponent(match)}`;
    });
  }

  // 4. Send DM via Instagram Graph API
  let dmStatus = "sent";
  let errorMessage = null;

  try {
    const url = `https://graph.facebook.com/v25.0/me/messages`;
    
    // Story Mentions require sending by ID. Standard comments can be replied to via comment_id.
    const recipientPayload = campaign.trigger_type === 'story_mention' 
      ? { id: commenterIgId } 
      : { comment_id: commentId };

    await axios.post(
      url,
      {
        recipient: recipientPayload,
        message: { text: messageToSend },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    // 4b. Send Public Comment Reply (if enabled)
    if (campaign.trigger_type === 'comment') {
      try {
        const replyText = campaign.public_reply_text || "You're on the list! Check your DMs soon.";
        await axios.post(
          `https://graph.facebook.com/v25.0/${commentId}/replies`,
          { message: replyText },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(`[Queue] Public reply sent for comment ${commentId}`);
      } catch (err) {
        console.error("[Queue] Public reply failed:", err.response?.data?.error?.message || err.message);
      }
    }
  } catch (err) {
    dmStatus = "failed";
    errorMessage = err.response?.data?.error?.message || err.message;
  }

  // 5. Log Result
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

  // 6. Update usage if sent
  if (dmStatus === "sent") {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { dms_sent: { increment: 1 } },
    });
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: { dms_used_this_month: { increment: 1 } },
    });

    if (!isGateMessage) {
      // Trigger Email Collection
      if (campaign.collect_email) {
        const promptKey = `email_prompt:${campaign.instagram_account.ig_user_id}:${commenterIgId}`;
        try {
          await pollerConnection.set(promptKey, campaignId, "EX", 86400); 
        } catch (err) {
          console.warn("[Memory DM Fallback] Could not save email_prompt key to Redis, skipping.", err.message);
        }
        
        try {
          await axios.post(
            `https://graph.facebook.com/v25.0/me/messages`,
            { recipient: { id: commenterIgId }, message: { text: campaign.email_prompt_message || "Want more? Drop your email!" } },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        } catch (err) { console.error("Email prompt failed", err.message); }
      }

      // Trigger Follow Up
      if (campaign.follow_up_time_hours && campaign.follow_up_message) {
        await addFollowUpJob({
          campaignId, commenterIgId, accessToken
        }, { delay: campaign.follow_up_time_hours * 3600000 });
      }
    }
  }

  if (dmStatus === "failed") {
    throw new Error(`DM failed: ${errorMessage}`);
  }
};

import { createRedisConnection } from "../config/redis.js";

export const dmWorker = new Worker("dm-send", processDm, { 
  connection: createRedisConnection(),
  stalledInterval: 300000
});

dmWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

dmWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} has failed with ${err.message}`);
});

dmWorker.on("error", (err) => console.error("[Worker Error]", err.message));
