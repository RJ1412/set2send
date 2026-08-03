/**
 * Entitlement Service
 * Determines what features a user can access based on their active subscription + add-ons.
 * Every protected API route calls checkFeature() before executing.
 *
 * Features:
 *  ctd          - Comment-to-DM (UNLIMITED on ALL plans — no volume check here)
 *  smr          - Story reply automation
 *  cpr          - Comment public reply
 *  fg           - Follow-gate
 *  ec           - Email collection
 *  crm          - CRM & contacts
 *  an           - Analytics dashboard
 *  ai           - AI suggestions
 *  wa           - WhatsApp bulk messaging
 *  custom_flows - Custom flow builder
 */

import { prisma } from "../utils/db.js";
import { PLAN_FEATURES, PLAN_LIMITS, PLAN_RANK } from "../config/plans.js";

/**
 * Get complete entitlement object for a user.
 * Reads active subscription, plan config, and purchased add-ons.
 *
 * @param {string} userId
 * @returns {object} entitlements
 */
export async function getUserEntitlements(userId) {
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId },
  });

  const isSubscriptionActive = Boolean(subscription) && subscription.status === "active" && (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());
  const legacyPlan = PLAN_FEATURES[subscription?.plan] ? subscription.plan : "free";
  const storedPlanKey = PLAN_FEATURES[subscription?.plan_key] ? subscription.plan_key : legacyPlan;
  const resolvedPlan = storedPlanKey === "free" && PLAN_RANK[legacyPlan] > PLAN_RANK.free ? legacyPlan : storedPlanKey;
  const planKey = isSubscriptionActive ? resolvedPlan : "free";
  const planConfig = PLAN_FEATURES[planKey] || PLAN_FEATURES["free"];

  // Parse purchased add-ons
  let purchasedAddons = [];
  if (subscription?.purchased_addons) {
    try {
      purchasedAddons = JSON.parse(subscription.purchased_addons);
    } catch {
      purchasedAddons = [];
    }
  }

  // Build feature set: plan features + purchased add-ons
  const allFeatures = new Set([...planConfig.features, ...purchasedAddons]);

  const isActive = !subscription || isSubscriptionActive;

  return {
    plan_key: planKey,
    plan_rank: PLAN_RANK[planKey],
    status: isActive ? "active" : subscription?.status || "active",
    is_active: isActive,
    features: isActive ? [...allFeatures] : [...PLAN_FEATURES.free.features],
    ig_accounts_included: planConfig.igIncl + (subscription?.extra_ig_accounts || 0),
    wa_accounts_included: (planConfig.waAccess || purchasedAddons.includes("wa")) ? planConfig.waIncl + (subscription?.extra_wa_accounts || 0) : 0,
    wa_access: planConfig.waAccess || purchasedAddons.includes("wa"),
    crm_contacts: planConfig.crmContacts,
    dm_limit: PLAN_LIMITS[planKey].dmsPerMonth,
    story_replies_limit: PLAN_LIMITS[planKey].storyRepliesPerMonth,
    wa_messages_limit: (planConfig.waAccess || purchasedAddons.includes("wa")) ? PLAN_LIMITS[planKey].waMessagesPerMonth : 0,
    current_period_end: subscription?.current_period_end,
    purchased_addons: purchasedAddons,
    extra_ig_accounts: subscription?.extra_ig_accounts || 0,
    extra_wa_accounts: subscription?.extra_wa_accounts || 0,
  };
}

/**
 * Check if a user has access to a specific feature.
 * Returns true/false — throws no exceptions.
 *
 * @param {string} userId
 * @param {string} featureKey
 * @returns {Promise<boolean>}
 */
export async function checkFeature(userId, featureKey) {
  const entitlements = await getUserEntitlements(userId);
  return entitlements.features.includes(featureKey);
}

/**
 * Middleware to protect routes based on feature access.
 * 
 * @param {string} featureKey 
 * @returns {import("express").RequestHandler}
 */
export function requireFeature(featureKey) {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const hasFeature = await checkFeature(req.userId, featureKey);
      if (!hasFeature) {
        return res.status(403).json({ 
          error: `Feature '${featureKey}' requires an active plan or add-on.`
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Check if a user can connect more Instagram accounts.
 * Compares their current connected accounts against plan limit.
 *
 * @param {string} userId
 * @returns {Promise<{allowed: boolean, current: number, limit: number}>}
 */
export async function checkIgAccountLimit(userId) {
  const entitlements = await getUserEntitlements(userId);
  const current = await prisma.instagramAccount.count({
    where: { user_id: userId, status: "active" },
  });

  return {
    allowed: current < entitlements.ig_accounts_included,
    current,
    limit: entitlements.ig_accounts_included,
  };
}

/**
 * Check if a user can connect more WhatsApp accounts.
 *
 * @param {string} userId
 * @returns {Promise<{allowed: boolean, current: number, limit: number}>}
 */
export async function checkWaAccountLimit(userId) {
  const entitlements = await getUserEntitlements(userId);
  const current = await prisma.whatsappAccount.count({
    where: { user_id: userId, status: "active" },
  });
  return {
    allowed: entitlements.wa_access && current < entitlements.wa_accounts_included,
    current,
    limit: entitlements.wa_accounts_included,
  };
}

