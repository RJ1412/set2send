import { prisma } from "./db.js";

/**
 * Helper to emit analytics events for campaigns
 * @param {string} campaignId - The Campaign ID
 * @param {string} eventName - The name of the event to emit
 * @param {string} commenterUsername - The username of the interacting user
 */
export const emitAnalyticsEvent = async (campaignId, eventName, commenterUsername) => {
  try {
    if (!campaignId || !eventName || !commenterUsername) return;

    await prisma.analyticsEvent.create({
      data: {
        campaign_id: campaignId,
        event_name: eventName,
        commenter_username: commenterUsername
      }
    });
    console.log(`[Analytics] Emitted: ${eventName} for ${commenterUsername} (Campaign: ${campaignId})`);
  } catch (err) {
    console.error(`[Analytics] Failed to emit event ${eventName}:`, err.message);
  }
};
