import { Queue } from "../utils/queueWrapper.js";
import { sharedQueueConnection } from "../config/redis.js";

export const pollerConnection = sharedQueueConnection;

export const dmPollerQueue = new Queue("dm-poller", { 
  connection: sharedQueueConnection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

export const initDmPoller = async () => {
  try {
    // Clear any existing repeatable jobs first
    const repeatableJobs = await dmPollerQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await dmPollerQueue.removeRepeatableByKey(job.key);
    }

    // Register the new job running every 30 seconds
    await dmPollerQueue.add("poll-dms", {}, {
      repeat: {
        every: 30000,
      }
    });
    
    console.log("🕒 DM Poller Queue initialized (running every 30s)");
  } catch (error) {
    console.error("⚠️ Failed to initialize BullMQ for DM poller. Falling back to setInterval for 30s polling.", error.message);
    
    // Fallback: manually import the processor and run it on interval
    const { processDmPolling } = await import("../jobs/dmPollerWorker.js");
    
    setInterval(async () => {
      try {
        await processDmPolling();
      } catch (e) {
        console.error("[DMPoller Fallback Error]", e);
      }
    }, 30000);
    console.log("🕒 DM Poller Fallback initialized (running every 30s)");
  }
};

dmPollerQueue.on("error", (err) => console.error("[Queue Error]", err.message));
