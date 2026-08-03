const prisma = require("../lib/prisma");

const PLANS = {
  free:    { name: "Starter",  igIncl: 1, waIncl: 0, waAccess: false, features: ["ctd","smr"] },
  creator: { name: "Creator",  igIncl: 1, waIncl: 1, waAccess: false, features: ["ctd","smr","cpr","fg","ec","an"] },
  growth:  { name: "Growth",   igIncl: 2, waIncl: 2, waAccess: true,  features: ["ctd","smr","cpr","fg","ec","crm","an","ai"] },
  biz:     { name: "Business", igIncl: 5, waIncl: 5, waAccess: true,  features: ["ctd","smr","cpr","fg","ec","crm","an","ai"] },
};

/**
 * Checks if a user is allowed to connect a new account for the specified platform.
 * @param {string} userId - The user's ID
 * @param {string} platform - "instagram" or "whatsapp"
 * @returns {Promise<{ allowed: boolean, limit: number, current: number, message?: string }>}
 */
async function checkAccountLimit(userId, platform) {
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId },
  });

  const planKey = subscription?.plan_key || "free";
  const plan = PLANS[planKey] || PLANS.free;

  let limit = 0;
  let current = 0;
  
  if (platform === "instagram") {
    limit = plan.igIncl + (subscription?.extra_ig_accounts || 0);
    current = await prisma.instagramAccount.count({
      where: { user_id: userId }
    });
  } else if (platform === "whatsapp") {
    const purchasedAddons = subscription?.purchased_addons ? JSON.parse(subscription.purchased_addons) : [];
    const hasWaAccess = plan.waAccess || purchasedAddons.includes("wa");
    const waBaseLimit = hasWaAccess ? (plan.waAccess ? plan.waIncl : 1) : 0;
    
    limit = waBaseLimit + (subscription?.extra_wa_accounts || 0);
    current = await prisma.whatsappAccount.count({
      where: { user_id: userId }
    });
  }

  if (current >= limit) {
    return { 
      allowed: false, 
      limit, 
      current, 
      message: `Account limit reached for ${platform} (${limit} allowed). Please upgrade your plan or purchase an add-on.` 
    };
  }

  return { allowed: true, limit, current };
}

module.exports = { checkAccountLimit };
