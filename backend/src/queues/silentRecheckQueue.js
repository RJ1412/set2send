import { Queue } from "../utils/queueWrapper.js";
import { sharedQueueConnection } from "../config/redis.js";

// Export this for backward compatibility if any file still imports it
export const pollerConnection = sharedQueueConnection;

export const silentRecheckQueue = new Queue("silent-recheck", { 
  connection: sharedQueueConnection,
  defaultJobOptions: {
    attempts: 1, // Max attempts: 1 (run once only)
    removeOnComplete: true,
    removeOnFail: 100,
  }
});

// Helper to register the singleton repeatable job
export const initSilentRecheckPoller = async () => {
  // Clear any existing repeatable jobs first
  const repeatableJobs = await silentRecheckQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await silentRecheckQueue.removeRepeatableByKey(job.key);
  }

  // Register the new job running every 24 hours
  await silentRecheckQueue.add('silent-recheck', {}, {
    repeat: {
      every: 86400000,
    }
  });
  
  console.log("🕒 Silent Recheck Poller Queue initialized (running every 24h)");
};

silentRecheckQueue.on("error", (err) => console.error("[Queue Error]", err.message));
