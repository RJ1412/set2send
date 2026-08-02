/**
 * Authoritative plan configuration for set2send.
 * This is the single source of truth used by:
 *  - Checkout (computing invoice amounts)
 *  - Entitlement checks (feature gating)
 *  - Pricing page API
 *  - Webhook handlers (subscription activation)
 */

// Plan monthly prices (INR). Annual = monthly × 0.8
export const PLAN_PRICES = {
  free:    0,
  creator: 299,
  growth:  699,
  biz:     1999,
};

export const PLAN_RANK = { free: 0, creator: 1, growth: 2, biz: 3 };

export const PLAN_LIMITS = {
  free: { dmsPerMonth: 2000, storyRepliesPerMonth: 100, waMessagesPerMonth: 0 },
  creator: { dmsPerMonth: null, storyRepliesPerMonth: null, waMessagesPerMonth: 500 },
  growth: { dmsPerMonth: null, storyRepliesPerMonth: null, waMessagesPerMonth: 2000 },
  biz: { dmsPerMonth: null, storyRepliesPerMonth: null, waMessagesPerMonth: 5000 },
};

export const PLAN_NAMES = {
  free: "Starter", creator: "Creator", growth: "Growth", biz: "Business",
};
// Annual discount factor
export const ANNUAL_DISCOUNT = 0.8;

// Add-on prices (monthly, INR)
export const ADDON_PRICES = {
  cpr: 69,   // Comment public reply
  fg:  99,   // Follow-gate
  ec:  79,   // Email collection
  crm: 99,   // CRM & contacts
  an:  69,   // Analytics dashboard
  ai:  49,   // AI suggestions
  wa:  149,  // WA bulk access (Creator only)
};

// Extra account prices (monthly, INR)
export const EXTRA_IG_PRICE = 99;
export const EXTRA_WA_PRICE = 49;

// WhatsApp per-message rates (user-facing price, INR)
export const WA_RATES = {
  auth: 0.14,
  mkt:  0.94,
  util: 0.14,
  intl: 3.40,
};

// Features included per plan (free add-on logic for paid plans)
export const PLAN_FEATURES = {
  free: {
    features: ["ctd", "smr"],
    igIncl: 1,
    waIncl: 0,
    waAccess: false,
    storyRepliesPerMonth: 100,   // story replies limited on free (display only — no server cap on ctd)
    crmContacts: 50,
  },
  creator: {
    features: ["ctd", "smr", "cpr", "fg", "ec", "an"],
    igIncl: 1,
    waIncl: 1,   // 1 WA number if wa add-on purchased
    waAccess: false, // needs wa add-on
    storyRepliesPerMonth: null,  // unlimited
    crmContacts: 50,             // basic CRM
  },
  growth: {
    features: ["ctd", "smr", "cpr", "fg", "ec", "crm", "an", "ai", "wa", "custom_flows"],
    igIncl: 2,
    waIncl: 2,
    waAccess: true,
    storyRepliesPerMonth: null,
    crmContacts: null,           // unlimited
  },
  biz: {
    features: ["ctd", "smr", "cpr", "fg", "ec", "crm", "an", "ai", "wa", "custom_flows"],
    igIncl: 5,
    waIncl: 5,
    waAccess: true,
    storyRepliesPerMonth: null,
    crmContacts: null,
  },
};

// Feature key descriptions (for UI labels)
export const FEATURE_LABELS = {
  ctd:          "Comment-to-DM",
  smr:          "Story reply automation",
  cpr:          "Comment public reply",
  fg:           "Follow-gate",
  ec:           "Email collection",
  crm:          "CRM & contacts",
  an:           "Analytics dashboard",
  ai:           "AI suggestions",
  wa:           "WhatsApp bulk messaging",
  custom_flows: "Custom flow builder",
};

/**
 * Compute the authoritative invoice for a checkout session.
 * All amounts in INR. Returns line items + total.
 *
 * @param {object} params
 * @param {string} params.plan_key - free | creator | growth | biz
 * @param {string} params.billing - monthly | annual
 * @param {string[]} params.addons - array of purchased addon keys
 * @param {number} params.extra_ig - extra IG accounts beyond plan inclusion
 * @param {number} params.extra_wa - extra WA accounts beyond plan inclusion
 * @param {number} params.wa_usage_estimate - estimated WA usage in INR
 * @param {number} params.coins_to_apply - coins to deduct (0 if not applying)
 * @returns {object} invoice
 */
export function computeInvoice({ plan_key, billing, addons = [], extra_ig = 0, extra_wa = 0, wa_usage_estimate = 0, coins_to_apply = 0 }) {
  const disc = billing === "annual" ? ANNUAL_DISCOUNT : 1;
  const planFeatures = PLAN_FEATURES[plan_key];

  if (!planFeatures) throw new Error(`Unknown plan_key: ${plan_key}`);

  // Base plan price
  const planPrice = Math.round(PLAN_PRICES[plan_key] * disc);

  // Add-ons (only those not already in plan)
  const addonTotal = addons.reduce((sum, key) => {
    if (ADDON_PRICES[key] && !planFeatures.features.includes(key)) {
      return sum + Math.round(ADDON_PRICES[key] * disc);
    }
    return sum;
  }, 0);

  // Extra accounts
  const extraIgTotal = extra_ig > 0 ? extra_ig * Math.round(EXTRA_IG_PRICE * disc) : 0;
  const extraWaTotal = extra_wa > 0 ? extra_wa * Math.round(EXTRA_WA_PRICE * disc) : 0;

  // WA usage (always at standard rate, no discount)
  const waUsage = Math.max(0, Math.round(wa_usage_estimate));

  const subtotal = planPrice + addonTotal + extraIgTotal + extraWaTotal + waUsage;

  // Coins deduction: clamp to subtotal, never go negative
  const maxCoinsApplicable = Math.floor(subtotal); // 1 coin = ₹1
  const coinsApplied = Math.min(coins_to_apply, maxCoinsApplicable);
  const coinsDiscount = coinsApplied; // in INR

  const total = Math.max(0, subtotal - coinsDiscount);

  return {
    plan_key,
    billing,
    plan_price: planPrice,
    addon_total: addonTotal,
    extra_ig_total: extraIgTotal,
    extra_wa_total: extraWaTotal,
    wa_usage: waUsage,
    subtotal,
    coins_applied: coinsApplied,
    coins_discount: coinsDiscount,

    total,             // amount to charge in INR
    total_paise: total * 100, // for Razorpay (paise)
  };
}

/**
 * Check if a plan is paid (non-free).
 */
export function isPaidPlan(plan_key) {
  return plan_key !== "free" && PLAN_PRICES[plan_key] > 0;
}

export function isPlanKey(planKey) {
  return Object.hasOwn(PLAN_PRICES, planKey);
}

export function sanitizeAddons(addons) {
  return [...new Set(Array.isArray(addons) ? addons.filter((key) => Object.hasOwn(ADDON_PRICES, key)) : [])];
}

// S2S Coins Constants
export const REFERRER_BONUS = 500;
export const REFEREE_BONUS = 500;
export const REDEMPTION_MINIMUM = 1000;
