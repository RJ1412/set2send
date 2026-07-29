import { Queue, Worker } from "../utils/queueWrapper.js";
import { env } from "../config/env.js";
import { prisma } from "../utils/db.js";
import axios from "axios";
import { sharedQueueConnection, createRedisConnection } from "../config/redis.js";

export const followUpQueueConnection = sharedQueueConnection;

export const followUpQueue = new Queue("follow-up-send", { 
  connection: sharedQueueConnection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

export const addFollowUpJob = async (data, opts = {}) => {
  try {
    await followUpQueue.add("process-follow-up", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      ...opts,
    });
  } catch (err) {
    console.error("⚠️ Failed to add FollowUp job to BullMQ. Falling back to memory timeout.", err.message);
    const delay = opts.delay || 1000;
    setTimeout(async () => {
      try {
        await processFollowUp({ data });
      } catch (e) {
        console.error("[Memory FollowUp Fallback Error]", e);
      }
    }, delay);
  }
};

export const processFollowUp = async (job) => {
  const { campaignId, commenterIgId, accessToken } = job.data;
  console.log(`[FollowUpQueue] Processing job:`, job.data);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign || campaign.status !== "active" || !campaign.follow_up_message) {
    return;
  }

  // Check if they clicked the original link
  const clicks = await prisma.linkClick.findMany({
    where: { campaign_id: campaignId, commenter_ig_id: commenterIgId, source: "original" }
  });

  if (clicks.length > 0) {
    console.log(`[FollowUpQueue] User ${commenterIgId} already clicked. Skipping follow-up.`);
    return;
  }

  console.log(`[FollowUpQueue] User ${commenterIgId} hasn't clicked. Sending follow-up.`);

  const apiUrl = env.API_URL || "http://localhost:5000";
  let messageToSend = campaign.follow_up_message;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  messageToSend = messageToSend.replace(urlRegex, (match) => {
     return `${apiUrl}/r?c=${campaignId}&u=${commenterIgId}&s=follow_up&url=${encodeURIComponent(match)}`;
  });

  try {
    await axios.post(
      `https://graph.facebook.com/v25.0/me/messages`,
      {
        recipient: { id: commenterIgId },
        message: { text: messageToSend },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { follow_ups_sent: { increment: 1 } }
    });

  } catch (err) {
    console.error(`[FollowUpQueue] Failed to send: ${err.message}`);
  }
};

export const followUpWorker = new Worker("follow-up-send", processFollowUp, { connection: createRedisConnection(), stalledInterval: 300000 });

followUpWorker.on("completed", (job) => console.log(`FollowUp Job ${job.id} completed.`));
followUpWorker.on("failed", (job, err) => console.error(`FollowUp Job ${job.id} failed: ${err.message}`));

followUpQueue.on("error", (err) => console.error("[Queue Error]", err.message));

followUpWorker.on("error", (err) => console.error("[Worker Error]", err.message));
