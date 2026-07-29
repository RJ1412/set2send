import { GoogleGenAI } from '@google/genai';
import { prisma } from "../utils/db.js";
import { env } from "../config/env.js";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const FALLBACK_SUGGESTIONS = [
  { priority: 1, category: "reactivation", title: "Re-engage cold leads", description: "You have cold leads with no recent activity. Create a re-engagement flow with a new offer to warm them up.", metric: "coldLeadsCount", estimatedImpact: "high", actionLabel: "Create Flow", actionRoute: "/flows/builder" },
  { priority: 2, category: "conversion", title: "Add email capture step", description: "Flows without an email capture node leave leads undermonetised. Add a 7-day delayed email ask to your top flow.", metric: "emailCaptureRate", estimatedImpact: "high", actionLabel: "Edit Flow", actionRoute: "/dashboard" },
  { priority: 3, category: "engagement", title: "Enable A/B testing", description: "Test two DM variants on your top flow to find which message gets more replies.", metric: "clickThroughRate", estimatedImpact: "medium", actionLabel: "Add A/B Test", actionRoute: "/dashboard" },
  { priority: 4, category: "growth", title: "Create a story flow", description: "Story replies are an untapped trigger. Create a story reply flow to capture leads from your next story post.", metric: "totalActiveFlows", estimatedImpact: "medium", actionLabel: "New Flow", actionRoute: "/flows/builder" },
];

export async function generateSuggestions(userId, forceRefresh = false) {
  // Check cache
  if (!forceRefresh) {
    const existingLog = await prisma.suggestionLog.findUnique({ where: { userId } });
    if (existingLog && existingLog.expiresAt > new Date()) {
      return existingLog.suggestions;
    }
  }

  try {
    // 1. Gather Analytics Context
    const leads = await prisma.lead.findMany({ where: { userId } });
    const totalLeads = leads.length;
    
    let dmsSent = 0, dmsOpened = 0, linksClicked = 0, emailsCaptured = 0, conversions = 0;
    let coldCount = 0, warmCount = 0, hotCount = 0, convertedCount = 0;
    let totalScore = 0;
    
    leads.forEach(l => {
      dmsSent += l.dmsSent;
      dmsOpened += l.dmsOpened;
      linksClicked += l.linksClicked;
      if (l.emailCaptured) emailsCaptured++;
      if (l.stage === "converted") {
        conversions++;
        convertedCount++;
      } else if (l.stage === "hot") {
        hotCount++;
      } else if (l.stage === "warm") {
        warmCount++;
      } else {
        coldCount++;
      }
      totalScore += l.score;
    });

    const openRate = dmsSent > 0 ? (dmsOpened / dmsSent) * 100 : 0;
    const clickThroughRate = dmsOpened > 0 ? (linksClicked / dmsOpened) * 100 : 0;
    const emailCaptureRate = totalLeads > 0 ? (emailsCaptured / totalLeads) * 100 : 0;
    const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;
    const avgLeadScore = totalLeads > 0 ? totalScore / totalLeads : 0;

    // Get Flows Performance
    const flows = await prisma.flow.findMany({
      where: { account_id: userId, status: 'active' },
      include: { leads: true }
    });
    const totalActiveFlows = flows.length;
    
    let topFlowName = "None", topFlowConversionRate = 0;
    let worstFlowName = "None", worstFlowConversionRate = 0;

    if (flows.length > 0) {
      const flowPerf = flows.map(f => {
        const fLeads = f.leads.length;
        const fConv = f.leads.filter(l => l.stage === 'converted').length;
        return { name: f.name, rate: fLeads > 0 ? (fConv / fLeads) * 100 : 0 };
      }).sort((a, b) => b.rate - a.rate);

      topFlowName = flowPerf[0].name;
      topFlowConversionRate = flowPerf[0].rate;
      worstFlowName = flowPerf[flowPerf.length - 1].name;
      worstFlowConversionRate = flowPerf[flowPerf.length - 1].rate;
    }

    const leadsTrend = "flat"; // Simplified, could call projectGrowth

    const prompt = `
You are a growth advisor for a social media automation platform called DMzy.
A user's account has the following performance metrics:

- Total leads captured: ${totalLeads}
- DM open rate: ${openRate.toFixed(1)}% (industry average: 85%)
- Link click-through rate: ${clickThroughRate.toFixed(1)}% (industry average: 15%)
- Email capture rate: ${emailCaptureRate.toFixed(1)}% (industry average: 12%)
- Conversion rate: ${conversionRate.toFixed(1)}% (industry average: 8%)
- Lead stage breakdown: ${coldCount} cold, ${warmCount} warm, ${hotCount} hot, ${convertedCount} converted
- Average lead score: ${avgLeadScore.toFixed(1)}/100
- Best performing flow: "${topFlowName}" at ${topFlowConversionRate.toFixed(1)}% conversion
- Worst performing flow: "${worstFlowName}" at ${worstFlowConversionRate.toFixed(1)}% conversion
- Lead growth trend: ${leadsTrend}
- Active flows: ${totalActiveFlows}

Based ONLY on this data, generate exactly 4 actionable suggestions to help this user improve their lead generation and conversion.

Rules:
- Each suggestion must reference a specific metric from the data above
- Suggestions must be specific and immediately actionable (not vague advice)
- Prioritise the biggest impact opportunity first
- Keep each suggestion under 40 words
- Do not mention AI, machine learning, or any tool other than DMzy features
- DMzy features available: comment triggers, story reply flows, follow-gate, delay sequences, A/B testing, email capture, WhatsApp broadcast

Respond ONLY with a valid JSON array. No preamble, no explanation, no markdown fences.
Format:
[
  {
    "priority": 1,
    "category": "conversion" | "engagement" | "reactivation" | "flow" | "growth",
    "title": "Short title (5 words max)",
    "description": "Actionable suggestion referencing specific metric",
    "metric": "the specific metric this addresses",
    "estimatedImpact": "low" | "medium" | "high",
    "actionLabel": "CTA text (3 words max)",
    "actionRoute": "/flows/builder" | "/leads" | "/analytics" 
  }
]
`;

    if (!ai) {
      throw new Error("Gemini API key is not configured.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const suggestionsText = response.text;
    let suggestions = [];
    try {
      suggestions = JSON.parse(suggestionsText);
      if (!Array.isArray(suggestions) || suggestions.length !== 4) {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error("Failed to parse Gemini suggestions:", e);
      suggestions = FALLBACK_SUGGESTIONS;
    }

    // Cache it
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await prisma.suggestionLog.upsert({
      where: { userId },
      update: { suggestions, generatedAt: new Date(), expiresAt },
      create: { userId, suggestions, generatedAt: new Date(), expiresAt }
    });

    return suggestions;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return FALLBACK_SUGGESTIONS;
  }
}
