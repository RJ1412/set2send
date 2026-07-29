import { Queue, Worker } from "../utils/queueWrapper.js";
import { redis } from "../utils/redis.js";
import { prisma } from "../utils/db.js";
import { recalculateLeadScore } from "../lib/leadScoring.js";

const connection = redis;

export const crmQueue = new Queue("crmQueue", { 
  connection,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 100 }
});

export const processCrm = async (job) => {
  const { type, data } = job.data || {};
  
  if (job.name === "analyticsSnapshotJob") {
    console.log("Running analyticsSnapshotJob...");
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(yesterday);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const users = await prisma.user.findMany({ select: { id: true } });
    
    for (const user of users) {
      // Get all leads created yesterday
      const newLeads = await prisma.lead.findMany({
        where: { userId: user.id, createdAt: { gte: yesterday, lt: nextDay } }
      });

      // Get all leads total for stage distribution
      const allLeads = await prisma.lead.findMany({
        where: { userId: user.id }
      });

      let dmsSent = 0, dmsOpened = 0, linksClicked = 0, emailsCaptured = 0, conversions = 0, followBacks = 0;
      let coldCount = 0, warmCount = 0, hotCount = 0, convertedCount = 0;

      newLeads.forEach(l => {
        dmsSent += l.dmsSent;
        dmsOpened += l.dmsOpened;
        linksClicked += l.linksClicked;
        if (l.emailCaptured) emailsCaptured++;
        if (l.stage === "converted") conversions++;
        if (l.isFollower) followBacks++;
      });

      allLeads.forEach(l => {
        if (l.stage === "cold") coldCount++;
        else if (l.stage === "warm") warmCount++;
        else if (l.stage === "hot") hotCount++;
        else if (l.stage === "converted") convertedCount++;
      });

      const openRate = dmsSent > 0 ? dmsOpened / dmsSent : 0;
      const clickRate = dmsOpened > 0 ? linksClicked / dmsOpened : 0;
      const emailCaptureRate = newLeads.length > 0 ? emailsCaptured / newLeads.length : 0;
      const conversionRate = newLeads.length > 0 ? conversions / newLeads.length : 0;

      await prisma.analyticsSnapshot.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: yesterday
          }
        },
        update: {
          totalLeads: allLeads.length,
          newLeads: newLeads.length,
          dmsSent, dmsOpened, linksClicked, emailsCaptured, conversions, followBacks,
          openRate, clickRate, emailCaptureRate, conversionRate,
          coldCount, warmCount, hotCount, convertedCount
        },
        create: {
          userId: user.id,
          date: yesterday,
          totalLeads: allLeads.length,
          newLeads: newLeads.length,
          dmsSent, dmsOpened, linksClicked, emailsCaptured, conversions, followBacks,
          openRate, clickRate, emailCaptureRate, conversionRate,
          coldCount, warmCount, hotCount, convertedCount
        }
      });

      // Invalidate redis cache
      try {
        const keys = await redis.keys(`analytics:*${user.id}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } catch (err) {
         console.warn("[CRM] Failed to invalidate redis cache, skipping.", err.message);
      }
    }
  }

  else if (job.name === "leadScoringJob") {
    console.log("Running leadScoringJob...");
    // For all leads with activity in last 24h, recalculate score
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const leadsToUpdate = await prisma.lead.findMany({
      where: { lastActivityAt: { gte: twentyFourHoursAgo } },
      select: { id: true }
    });

    for (const lead of leadsToUpdate) {
      await recalculateLeadScore(lead.id);
    }
  }

  else if (job.name === "suggestionRefreshJob") {
    console.log("Running suggestionRefreshJob...");
    // Delete expired SuggestionLog entries
    await prisma.suggestionLog.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });
  }

  else if (job.name === "staleLeadJob") {
    console.log("Running staleLeadJob...");
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const leads = await prisma.lead.findMany({
      where: { 
        lastActivityAt: { lt: sevenDaysAgo },
        stage: { not: "converted" }
      }
    });

    for (const lead of leads) {
      let penalty = 0;
      if (lead.lastActivityAt < fourteenDaysAgo) {
        penalty = 10;
      } else if (lead.lastActivityAt < sevenDaysAgo) {
        penalty = 5;
      }

      if (penalty > 0) {
        // Record decay activity to trigger recalculation
        await prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: "score_decay",
            metadata: { penalty }
          }
        });
        await recalculateLeadScore(lead.id);
      }
    }
  }
};

const worker = new Worker("crmQueue", processCrm, { connection, stalledInterval: 300000 });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});

// Helper to schedule recurring jobs
export async function setupCrmCronJobs() {
  try {
    await crmQueue.add("analyticsSnapshotJob", {}, { repeat: { pattern: '5 0 * * *' } }); // 00:05 UTC
    await crmQueue.add("leadScoringJob", {}, { repeat: { pattern: '0 */6 * * *' } }); // Every 6 hours
    await crmQueue.add("suggestionRefreshJob", {}, { repeat: { pattern: '0 6 * * *' } }); // 06:00 UTC
    await crmQueue.add("staleLeadJob", {}, { repeat: { pattern: '0 0 * * *' } }); // Daily at midnight
  } catch (err) {
    console.error("⚠️ Failed to schedule CRM cron jobs via BullMQ. Falling back to setInterval.", err.message);
    
    // Daily fallback interval
    setInterval(async () => {
       try {
         await processCrm({ name: "analyticsSnapshotJob", data: {} });
         await processCrm({ name: "staleLeadJob", data: {} });
         await processCrm({ name: "suggestionRefreshJob", data: {} });
       } catch (e) {
         console.error("[Memory CRM Fallback Error]", e);
       }
    }, 86400000); // Daily
    
    // 6-hour fallback interval
    setInterval(async () => {
       try {
         await processCrm({ name: "leadScoringJob", data: {} });
       } catch (e) {
         console.error("[Memory CRM Fallback Error]", e);
       }
    }, 21600000); // 6 hours
  }
}

crmQueue.on("error", (err) => console.error("[Queue Error]", err.message));

worker.on("error", (err) => console.error("[Worker Error]", err.message));
