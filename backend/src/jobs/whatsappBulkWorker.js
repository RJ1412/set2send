import { Worker, UnrecoverableError } from "../utils/queueWrapper.js";
import axios from "axios";
import { sharedQueueConnection } from "../config/redis.js";
import { prisma } from "../utils/db.js";

export const processJob = async (job) => {
  const {
    logId,
    campaignId,
    phone,
    name,
    messageType,
    templateName,
    templateParams,
    freeformBody,
    accessToken,
    phoneNumberId,
  } = job.data;

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  let payload = {};

  if (messageType === "template") {
    payload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_US" },
        components: templateParams?.length
          ? [
              {
                type: "body",
                parameters: templateParams.map((p) => ({ type: "text", text: p })),
              },
            ]
          : [],
      },
    };
  } else if (messageType === "freeform") {
    payload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: freeformBody },
    };
  }

  let isSuccess = false;
  let waMessageId = null;
  let errorCode = null;
  let errorMessage = null;

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    isSuccess = true;
    waMessageId = response.data.messages[0].id;

    // Success update
    await prisma.whatsappLog.update({
      where: { id: logId },
      data: {
        status: "sent",
        waMessageId,
        sentAt: new Date(),
      },
    });
  } catch (error) {
    errorCode = error.response?.data?.error?.code?.toString() || "UNKNOWN";
    errorMessage = error.response?.data?.error?.message || error.message;

    // Check if error is retryable (130429 or 5xx)
    const isRateLimit = errorCode === "130429";
    const status = error.response?.status;
    const isServerError = status >= 500 && status < 600;

    if (isRateLimit || isServerError) {
      // We want to retry. Throwing an error lets BullMQ retry based on job options
      throw new Error(`Retryable error: ${errorCode} - ${errorMessage}`);
    }

    // Non-retryable error (e.g., 131026, 131047)
    await prisma.whatsappLog.update({
      where: { id: logId },
      data: {
        status: "failed",
        errorCode,
        errorMessage,
      },
    });
  }

  // After every job (success or non-retryable failure), update campaign stats
  // We use a transaction to safely increment counts and check remaining
  await prisma.$transaction(async (tx) => {
    // Increment sent/failed
    await tx.whatsappCampaign.update({
      where: { id: campaignId },
      data: {
        sentCount: isSuccess ? { increment: 1 } : undefined,
        failedCount: !isSuccess && errorCode ? { increment: 1 } : undefined, // Only increment if we caught a non-retryable error
      },
    });

    // Check remaining queued
    const remaining = await tx.whatsappLog.count({
      where: {
        campaignId: campaignId,
        status: "queued",
      },
    });

    if (remaining === 0) {
      // Mark as completed
      await tx.whatsappCampaign.update({
        where: { id: campaignId },
        data: { status: "completed" },
      });
    }
  });
};

// Bypassed Redis: Worker instantiation removed so it runs purely in-memory.
// export const whatsappBulkWorker = new Worker("whatsapp-bulk-sender", processJob, ...);
