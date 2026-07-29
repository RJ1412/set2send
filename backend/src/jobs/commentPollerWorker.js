import { Worker } from "../utils/queueWrapper.js";
import axios from "axios";
import { pollerConnection } from "../queues/commentPollerQueue.js";
import { addDmJob } from "../queues/dmQueue.js";
import { prisma } from "../utils/db.js";

// In-memory fallback cache
const fallbackCache = new Map();
const FALLBACK_TTL = 604800 * 1000;

async function checkBackoff(key) {
  try {
    return await pollerConnection.exists(key);
  } catch (err) {
    if (fallbackCache.has(key)) {
      if (Date.now() < fallbackCache.get(key).expires) return true;
      fallbackCache.delete(key);
    }
    return false;
  }
}

async function setBackoff(key, ttlSeconds) {
  try {
    await pollerConnection.set(key, "1", "EX", ttlSeconds);
  } catch (err) {
    fallbackCache.set(key, { expires: Date.now() + (ttlSeconds * 1000) });
  }
}

async function checkAndSetDedupe(key) {
  try {
    const isNew = await pollerConnection.set(key, "1", "EX", 604800, "NX");
    return isNew !== null;
  } catch (err) {
    // Redis failed, use memory fallback
    if (fallbackCache.has(key)) {
      const { expires } = fallbackCache.get(key);
      if (Date.now() < expires) return false;
    }
    fallbackCache.set(key, { expires: Date.now() + FALLBACK_TTL });
    
    // cleanup memory cache occasionally
    if (fallbackCache.size > 10000) {
      const now = Date.now();
      for (const [k, v] of fallbackCache.entries()) {
        if (now > v.expires) fallbackCache.delete(k);
      }
    }
    return true;
  }
}

export const processPoller = async (job) => {
  console.log(`[Poller] Starting comment polling cycle...`);
  
  // 1. Fetch active campaigns
  const activeCampaigns = await prisma.campaign.findMany({
    where: { status: "active" },
    include: { instagram_account: true }
  });

  if (activeCampaigns.length === 0) {
    return;
  }

  for (const campaign of activeCampaigns) {
    const accessToken = campaign.instagram_account.access_token;
    const igUserId = campaign.instagram_account.ig_user_id;
    
    // Check backoff
    const backoffKey = `backoff:${campaign.id}`;
    const isBackoff = await checkBackoff(backoffKey);
    if (isBackoff) {
      console.log(`[Poller] Skipping campaign ${campaign.id} due to rate limit backoff.`);
      continue;
    }

    try {
      let mediaIdsToPoll = [];
      
      // 2. Determine Media IDs to poll
      if (campaign.ig_media_id === "ALL_POSTS") {
        // Fetch recent 10 posts
        const mediaRes = await axios.get(`https://graph.facebook.com/v25.0/${igUserId}/media`, {
          params: {
            fields: "id",
            access_token: accessToken,
            limit: 10
          }
        });
        mediaIdsToPoll = (mediaRes.data.data || []).map(m => m.id);
      } else {
        mediaIdsToPoll = [campaign.ig_media_id];
      }

      // 3. Fetch comments for each media ID
      for (const mediaId of mediaIdsToPoll) {
        if (!mediaId) continue;
        
        let hasNext = true;
        let afterCursor = null;

        while (hasNext) {
          const commentsRes = await axios.get(`https://graph.facebook.com/v25.0/${mediaId}/comments`, {
            params: {
              fields: "id,text,from,timestamp",
              access_token: accessToken,
              limit: 50,
              after: afterCursor
            }
          });

          const comments = commentsRes.data.data || [];
          
          for (const comment of comments) {
            // Ignore own comments
            if (comment.from && comment.from.id === igUserId) {
              continue;
            }

            // 4. Deduplication
            const redisKey = `processed_comment:${campaign.id}:${comment.id}`;
            const isNew = await checkAndSetDedupe(redisKey);
            
            if (!isNew) {
              continue; // Already processed
            }

            console.log(`[Poller] 👀 Found NEW comment by @${comment.from?.username}: "${comment.text}"`);

            // 5. Keyword Matching
            const keyword = campaign.keyword.toLowerCase().trim();
            const text = (comment.text || "").toLowerCase();
            const cleanText = text.replace(/[.,!?()[\]{}"']/g, ' ');
            const isMatch = campaign.fuzzy_match 
              ? text.includes(keyword) 
              : cleanText.split(/\s+/).includes(keyword);

            if (!isMatch) {
              console.log(`[Poller] ⚠️ Comment "${comment.text}" did NOT match keyword "${keyword}"`);
            }

            if (isMatch) {
              console.log(`[Poller] Keyword matched for comment ${comment.id}! Dispatching DM job...`);
              // 6. Job Dispatch
              await addDmJob({
                campaignId: campaign.id,
                commenterIgId: comment.from.id,
                commenterUsername: comment.from.username,
                commentText: comment.text,
                commentId: comment.id,
              });
            }
          }

          // Handle Pagination
          if (commentsRes.data.paging && commentsRes.data.paging.cursors && commentsRes.data.paging.cursors.after) {
            afterCursor = commentsRes.data.paging.cursors.after;
          } else {
            hasNext = false;
          }
        }
      }
    } catch (err) {
      const fbError = err.response?.data?.error;
      console.error(`[Poller] Error processing campaign ${campaign.id}:`, fbError || err.message);

      if (fbError) {
        // OAuth Exception (Token expired/invalid)
        if (fbError.code === 190) {
          console.warn(`[Poller] Token invalid for account ${igUserId}. Disabling...`);
          await prisma.instagramAccount.update({
            where: { id: campaign.instagram_account.id },
            data: { status: "invalid_token" }
          });
        }
        // Rate Limiting
        else if (fbError.code === 4 || fbError.code === 32) {
          console.warn(`[Poller] Rate limited on campaign ${campaign.id}. Backing off for 10 mins...`);
          await setBackoff(backoffKey, 600);
        }
      }
      // Never crash the poller loop
    }
  }
};

import { createRedisConnection } from "../config/redis.js";

export const commentPollerWorker = new Worker("comment-poller", processPoller, { 
  connection: createRedisConnection()
});

commentPollerWorker.on("completed", (job) => {
  console.log(`[Poller] Cycle completed successfully.`);
});

commentPollerWorker.on("failed", (job, err) => {
  console.error(`[Poller] Cycle failed: ${err.message}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down comment poller gracefully...");
  await commentPollerWorker.close();
});

commentPollerWorker.on("error", (err) => console.error("[Worker Error]", err.message));
