import { prisma } from "../utils/db.js";

// SCORING RULES
// +5   → Lead entered any flow
// +10  → DM was opened (read receipt)
// +8   → Lead replied to a DM (any reply)
// +15  → Lead replied with a keyword (positive intent keyword list)
// +12  → Clicked a link in DM
// +20  → Email captured
// +10  → Followed back (isFollower became true)
// +15  → Completed a full flow (reached last node)
// +5   → Replied to WhatsApp message
// +8   → Clicked WhatsApp link
// -5   → No activity for 7 days after last touch
// -10  → No activity for 14 days after last touch (stale)
// +25  → Marked as converted by user

const POSITIVE_INTENT_KEYWORDS = ["yes", "interested", "tell me more", "how much", "price", "buy", "enroll", "join", "info"];

export function getStageFromScore(score) {
  if (score >= 75) return "converted";
  if (score >= 45) return "hot";
  if (score >= 20) return "warm";
  return "cold";
}

export async function recalculateLeadScore(leadId) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { activities: true }
  });

  if (!lead) return;

  let score = 0;
  let isManuallyConverted = false;

  for (const activity of lead.activities) {
    switch (activity.type) {
      case "flow_entered":
        score += 5;
        break;
      case "dm_opened":
        score += 10;
        break;
      case "dm_replied":
        score += 8;
        if (activity.metadata && activity.metadata.text) {
          const text = activity.metadata.text.toLowerCase();
          const hasKeyword = POSITIVE_INTENT_KEYWORDS.some(kw => text.includes(kw));
          if (hasKeyword) score += 15;
        }
        break;
      case "link_clicked":
        score += 12;
        break;
      case "email_captured":
        score += 20;
        break;
      case "follow_back":
        score += 10;
        break;
      case "flow_completed":
        score += 15;
        break;
      case "whatsapp_replied":
        score += 5;
        break;
      case "whatsapp_link_clicked":
        score += 8;
        break;
      case "score_decay":
        if (activity.metadata && activity.metadata.penalty) {
          score -= activity.metadata.penalty;
        }
        break;
      case "stage_changed":
        if (activity.metadata && activity.metadata.newStage === "converted") {
          score += 25;
          isManuallyConverted = true;
        }
        break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let newStage = getStageFromScore(score);
  if (isManuallyConverted || lead.stage === "converted") {
    newStage = "converted";
    if (score < 75) score = 75; // Ensure score maps to stage at least
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      score,
      stage: newStage
    }
  });
}

export async function runScoringJobForUser(userId) {
  const leads = await prisma.lead.findMany({
    where: { userId }
  });

  for (const lead of leads) {
    await recalculateLeadScore(lead.id);
  }
}
