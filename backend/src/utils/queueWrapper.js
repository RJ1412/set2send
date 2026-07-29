import { env } from "../config/env.js";
import * as realBullmq from "bullmq";
import { EventEmitter } from "events";

const workers = new Map(); // name -> Worker instance
const activeIntervals = new Set();
const activeTimeouts = new Set();

class MockQueue extends EventEmitter {
  constructor(name, opts) {
    super();
    this.name = name;
    this.opts = opts;
    console.log(`[Mock Queue] Queue "${name}" initialized`);
  }

  async add(name, data, opts = {}) {
    const workerName = this.name;

    // Check if repeatable
    if (opts.repeat) {
      let intervalMs = 30000; // default 30s
      if (opts.repeat.every) {
        intervalMs = opts.repeat.every;
      } else if (opts.repeat.pattern) {
        const pattern = opts.repeat.pattern;
        if (pattern.includes("*/6")) {
          intervalMs = 6 * 3600 * 1000; // 6 hours
        } else {
          intervalMs = 24 * 3600 * 1000; // 24 hours (daily)
        }
      }

      console.log(`[Mock Queue] Registering repeatable job "${name}" for queue "${this.name}" every ${intervalMs}ms`);

      const interval = setInterval(async () => {
        const activeWorker = workers.get(workerName);
        if (activeWorker) {
          try {
            await activeWorker.processor({ name, data });
          } catch (err) {
            console.error(`[Mock Worker Error] Repeatable job "${name}" on "${workerName}" failed:`, err);
          }
        }
      }, intervalMs);

      activeIntervals.add(interval);
      return { id: `repeat-${Date.now()}` };
    }

    const delay = opts.delay || 0;
    const jobId = `job-${Math.random().toString(36).substr(2, 9)}`;

    const runJob = async () => {
      const activeWorker = workers.get(workerName);
      if (activeWorker) {
        try {
          console.log(`[Mock Queue] Running job ${jobId} on queue "${this.name}"`);
          await activeWorker.processor({ id: jobId, name, data });
          activeWorker.emit("completed", { id: jobId, name, data });
        } catch (err) {
          console.error(`[Mock Worker Error] Job ${jobId} on "${this.name}" failed:`, err);
          activeWorker.emit("failed", { id: jobId, name, data }, err);
        }
      } else {
        console.warn(`[Mock Queue] No worker registered for queue "${this.name}" yet. Execution deferred.`);
        setTimeout(runJob, 500);
      }
    };

    if (delay > 0) {
      console.log(`[Mock Queue] Scheduling job ${jobId} on queue "${this.name}" with delay ${delay}ms`);
      const timeout = setTimeout(runJob, delay);
      activeTimeouts.add(timeout);
    } else {
      process.nextTick(runJob);
    }

    return { id: jobId };
  }

  async getRepeatableJobs() {
    return [];
  }

  async removeRepeatableByKey(key) {
    return true;
  }

  async getWaitingCount() { return 0; }
  async getActiveCount() { return 0; }
  async getFailedCount() { return 0; }
}

class MockWorker extends EventEmitter {
  constructor(name, processor, opts) {
    super();
    this.name = name;
    this.processor = processor;
    this.opts = opts;
    workers.set(name, this);
    console.log(`[Mock Worker] Worker registered for queue "${name}"`);
  }

  async close() {
    workers.delete(this.name);
    console.log(`[Mock Worker] Worker for queue "${this.name}" closed.`);
  }
}

class MockUnrecoverableError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnrecoverableError";
  }
}

export const Queue = env.BYPASS_REDIS === "true" ? MockQueue : realBullmq.Queue;
export const Worker = env.BYPASS_REDIS === "true" ? MockWorker : realBullmq.Worker;
export const UnrecoverableError = env.BYPASS_REDIS === "true" ? MockUnrecoverableError : realBullmq.UnrecoverableError;
