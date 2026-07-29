import { Queue } from "../utils/queueWrapper.js";
import { sharedQueueConnection } from "../config/redis.js";

// Export this for backward compatibility if any file still imports it
export const queueConnection = sharedQueueConnection;

export const dmQueue = new Queue("dm-send", { 
  connection: sharedQueueConnection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

export const addDmJob = async (data, opts = {}) => {
  try {
    await dmQueue.add("process-comment", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      ...opts,
    });
  } catch (err) {
    console.error("⚠️ Failed to add DM job to BullMQ. Falling back to immediate memory execution.", err.message);
    const { processDm } = await import("../jobs/dmWorker.js");
    // Run it detached so it doesn't block the caller
    setTimeout(async () => {
      try {
        await processDm({ data });
      } catch (e) {
        console.error("[Memory DM Fallback Error]", e);
      }
    }, 100);
  }
};

dmQueue.on("error", (err) => console.error("[Queue Error]", err.message));
