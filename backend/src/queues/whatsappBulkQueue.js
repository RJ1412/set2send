import { Queue } from "../utils/queueWrapper.js";
import { sharedQueueConnection } from "../config/redis.js";

// Export this for backward compatibility if any file still imports it
export const queueConnection = sharedQueueConnection;

export const whatsappBulkQueue = new Queue("whatsapp-bulk-sender", { 
  connection: sharedQueueConnection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

export const addWhatsappBulkJob = async (data, opts = {}) => {
  // Bypass Redis entirely for the demo
  const { processJob } = await import("../jobs/whatsappBulkWorker.js");
  console.log("🚀 Bypassing Redis: Executing WhatsApp job in-memory...");
  setTimeout(async () => {
    try {
      await processJob({ data });
    } catch (e) {
      console.error("[Memory WA Fallback Error]", e);
    }
  }, 100);
};

whatsappBulkQueue.on("error", (err) => console.error("[Queue Error]", err.message));
