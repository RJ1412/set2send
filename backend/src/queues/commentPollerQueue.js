import { Queue } from "../utils/queueWrapper.js";
import { sharedQueueConnection } from "../config/redis.js";

// Export this for backward compatibility if any file still imports it
export const pollerConnection = sharedQueueConnection;

export const commentPollerQueue = new Queue("comment-poller", { 
  connection: sharedQueueConnection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

// Helper to register the singleton repeatable job
export const initCommentPoller = async () => {
  try {
    // Clear any existing repeatable jobs first to avoid duplicates if config changes
    const repeatableJobs = await commentPollerQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await commentPollerQueue.removeRepeatableByKey(job.key);
    }

    // Register the new job running every 30 seconds
    await commentPollerQueue.add("poll-comments", {}, {
      repeat: {
        every: 30000,
      }
    });
    
    console.log("🕒 Comment Poller Queue initialized (running every 30s)");
  } catch (error) {
    console.error("⚠️ Failed to initialize BullMQ for comment poller. Falling back to setInterval for 30s polling.", error.message);
    
    // Fallback: manually import the processor and run it on interval
    const { processPoller } = await import("../jobs/commentPollerWorker.js");
    
    setInterval(async () => {
      try {
        await processPoller();
      } catch (e) {
        console.error("[Poller Fallback Error]", e);
      }
    }, 30000);
    
    console.log("🕒 Comment Poller Fallback initialized (running every 30s)");
  }
};

commentPollerQueue.on("error", (err) => console.error("[Queue Error]", err.message));
