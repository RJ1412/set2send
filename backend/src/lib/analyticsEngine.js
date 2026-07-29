import { prisma } from "../utils/db.js";

export async function getDashboardMetrics(userId, dateRange) {
  const { from, to } = dateRange;
  const duration = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - duration);
  const prevTo = new Date(to.getTime() - duration);

  const getStats = async (start, end) => {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { userId, date: { gte: start, lte: end } }
    });
    
    return snapshots.reduce((acc, snap) => {
      acc.newLeads += snap.newLeads;
      acc.dmsSent += snap.dmsSent;
      acc.dmsOpened += snap.dmsOpened;
      acc.linksClicked += snap.linksClicked;
      acc.emailsCaptured += snap.emailsCaptured;
      acc.conversions += snap.conversions;
      return acc;
    }, {
      newLeads: 0, dmsSent: 0, dmsOpened: 0, 
      linksClicked: 0, emailsCaptured: 0, conversions: 0
    });
  };

  const current = await getStats(from, to);
  const previous = await getStats(prevFrom, prevTo);

  const calcDelta = (curr, prev) => prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;
  
  const openRate = current.dmsSent > 0 ? current.dmsOpened / current.dmsSent : 0;
  const clickThroughRate = current.dmsOpened > 0 ? current.linksClicked / current.dmsOpened : 0;
  const emailCaptureRate = current.newLeads > 0 ? current.emailsCaptured / current.newLeads : 0;
  const conversionRate = current.newLeads > 0 ? current.conversions / current.newLeads : 0;

  const prevOpenRate = previous.dmsSent > 0 ? previous.dmsOpened / previous.dmsSent : 0;
  const prevClickRate = previous.dmsOpened > 0 ? previous.linksClicked / previous.dmsOpened : 0;
  const prevEmailRate = previous.newLeads > 0 ? previous.emailsCaptured / previous.newLeads : 0;
  const prevConversionRate = previous.newLeads > 0 ? previous.conversions / previous.newLeads : 0;

  const totalLeads = await prisma.lead.count({ where: { userId } });
  
  const stageDistribution = {
    cold: await prisma.lead.count({ where: { userId, stage: "cold" } }),
    warm: await prisma.lead.count({ where: { userId, stage: "warm" } }),
    hot: await prisma.lead.count({ where: { userId, stage: "hot" } }),
    converted: await prisma.lead.count({ where: { userId, stage: "converted" } }),
  };

  const flows = await getFlowPerformance(userId);
  const topFlow = flows.length > 0 ? flows[0] : null;

  const posts = await getPostPerformance(userId, 1);
  const topPost = posts.length > 0 ? posts[0] : null;

  const convertedLeads = await prisma.lead.findMany({
    where: { userId, stage: "converted", convertedAt: { not: null } },
    select: { createdAt: true, convertedAt: true }
  });
  
  let avgTimeToConvert = 0;
  if (convertedLeads.length > 0) {
    const totalTime = convertedLeads.reduce((acc, l) => acc + (l.convertedAt.getTime() - l.createdAt.getTime()), 0);
    avgTimeToConvert = totalTime / convertedLeads.length / (1000 * 60 * 60); 
  }

  // Need array format for donut charts
  const stageDistributionArr = [
    { stage: "cold", count: stageDistribution.cold, percentage: totalLeads > 0 ? (stageDistribution.cold / totalLeads) * 100 : 0 },
    { stage: "warm", count: stageDistribution.warm, percentage: totalLeads > 0 ? (stageDistribution.warm / totalLeads) * 100 : 0 },
    { stage: "hot", count: stageDistribution.hot, percentage: totalLeads > 0 ? (stageDistribution.hot / totalLeads) * 100 : 0 },
    { stage: "converted", count: stageDistribution.converted, percentage: totalLeads > 0 ? (stageDistribution.converted / totalLeads) * 100 : 0 }
  ];

  const sourceBdown = await getLeadSourceBreakdown(userId, dateRange);
  const totalSources = Object.values(sourceBdown).reduce((a, b) => a + b, 0);
  const sourceBreakdownArr = Object.entries(sourceBdown).map(([source, count]) => ({
    source, count, percentage: totalSources > 0 ? (count / totalSources) * 100 : 0
  }));

  return {
    kpis: {
      totalLeads: { value: totalLeads, delta: null },
      newLeads: { value: current.newLeads, delta: calcDelta(current.newLeads, previous.newLeads) },
      dmsSent: { value: current.dmsSent, delta: calcDelta(current.dmsSent, previous.dmsSent) },
      dmsOpened: { value: current.dmsOpened, delta: calcDelta(current.dmsOpened, previous.dmsOpened) },
      openRate: { value: (openRate * 100).toFixed(1), delta: calcDelta(openRate, prevOpenRate) },
      linksClicked: { value: current.linksClicked, delta: calcDelta(current.linksClicked, previous.linksClicked) },
      clickThroughRate: { value: (clickThroughRate * 100).toFixed(1), delta: calcDelta(clickThroughRate, prevClickRate) },
      emailsCaptured: { value: current.emailsCaptured, delta: calcDelta(current.emailsCaptured, previous.emailsCaptured) },
      emailCaptureRate: { value: (emailCaptureRate * 100).toFixed(1), delta: calcDelta(emailCaptureRate, prevEmailRate) },
      conversions: { value: current.conversions, delta: calcDelta(current.conversions, previous.conversions) },
      conversionRate: { value: (conversionRate * 100).toFixed(1), delta: calcDelta(conversionRate, prevConversionRate) },
      avgLeadScore: { value: 0, delta: null },
      avgTimeToConvert: { value: (avgTimeToConvert).toFixed(1), delta: null }
    },
    stageDistribution: stageDistributionArr,
    sourceBreakdown: sourceBreakdownArr,
  };
}

export async function getTimeSeriesData(userId, metric, granularity, dateRange) {
  const { from, to } = dateRange;
  const snapshots = await prisma.analyticsSnapshot.findMany({
    where: { userId, date: { gte: from, lte: to } },
    orderBy: { date: 'asc' }
  });

  const results = [];
  if (granularity === "day") {
    for (const snap of snapshots) {
      let value = 0;
      if (metric === "newLeads") value = snap.newLeads;
      if (metric === "dmsSent") value = snap.dmsSent;
      if (metric === "dmsOpened") value = snap.dmsOpened;
      if (metric === "linksClicked") value = snap.linksClicked;
      if (metric === "emailsCaptured") value = snap.emailsCaptured;
      if (metric === "conversions") value = snap.conversions;
      if (metric === "openRate") value = snap.openRate;
      if (metric === "clickRate") value = snap.clickRate;
      if (metric === "emailCaptureRate") value = snap.emailCaptureRate;
      if (metric === "conversionRate") value = snap.conversionRate;
      
      results.push({ date: snap.date.toISOString(), value });
    }
  } else {
    // Basic week grouping logic 
    let currentWeek = null;
    let weekSum = 0;
    let weekCount = 0;
    for (const snap of snapshots) {
      const snapDate = new Date(snap.date);
      const day = snapDate.getDay() || 7; 
      snapDate.setHours(-24 * (day - 1));
      const weekStr = snapDate.toISOString().split('T')[0];
      
      if (currentWeek !== weekStr) {
        if (currentWeek) {
          results.push({ 
            date: currentWeek, 
            value: metric.includes("Rate") ? weekSum / weekCount : weekSum 
          });
        }
        currentWeek = weekStr;
        weekSum = 0;
        weekCount = 0;
      }
      
      if (metric === "newLeads") weekSum += snap.newLeads;
      if (metric === "dmsSent") weekSum += snap.dmsSent;
      if (metric === "dmsOpened") weekSum += snap.dmsOpened;
      if (metric === "linksClicked") weekSum += snap.linksClicked;
      if (metric === "emailsCaptured") weekSum += snap.emailsCaptured;
      if (metric === "conversions") weekSum += snap.conversions;
      if (metric === "openRate") weekSum += snap.openRate;
      if (metric === "clickRate") weekSum += snap.clickRate;
      if (metric === "emailCaptureRate") weekSum += snap.emailCaptureRate;
      if (metric === "conversionRate") weekSum += snap.conversionRate;
      weekCount++;
    }
    if (currentWeek) {
      results.push({ 
        date: currentWeek, 
        value: metric.includes("Rate") ? weekSum / weekCount : weekSum 
      });
    }
  }
  
  return results;
}

export async function getFunnelData(userId, dateRange) {
  const { from, to } = dateRange;
  const leads = await prisma.lead.findMany({
    where: { userId, createdAt: { gte: from, lte: to } }
  });

  const totals = leads.reduce((acc, lead) => {
    acc.commentsDetected++; 
    acc.dmsSent += lead.dmsSent > 0 ? 1 : 0;
    acc.dmsOpened += lead.dmsOpened > 0 ? 1 : 0;
    acc.linksClicked += lead.linksClicked > 0 ? 1 : 0;
    acc.emailsCaptured += lead.emailCaptured ? 1 : 0;
    acc.conversions += lead.stage === "converted" ? 1 : 0;
    return acc;
  }, { commentsDetected: 0, dmsSent: 0, dmsOpened: 0, linksClicked: 0, emailsCaptured: 0, conversions: 0 });

  const funnel = [
    { stage: "Comments Detected", count: totals.commentsDetected, dropOffCount: 0, dropOffPercent: 0 },
    { stage: "DMs Sent", count: totals.dmsSent, dropOffCount: 0, dropOffPercent: 0 },
    { stage: "DMs Opened", count: totals.dmsOpened, dropOffCount: 0, dropOffPercent: 0 },
    { stage: "Links Clicked", count: totals.linksClicked, dropOffCount: 0, dropOffPercent: 0 },
    { stage: "Emails Captured", count: totals.emailsCaptured, dropOffCount: 0, dropOffPercent: 0 },
    { stage: "Converted", count: totals.conversions, dropOffCount: 0, dropOffPercent: 0 }
  ];

  for (let i = 1; i < funnel.length; i++) {
    const prevCount = funnel[i-1].count;
    funnel[i].dropOffCount = prevCount - funnel[i].count;
    funnel[i].dropOffPercent = prevCount > 0 ? (funnel[i].dropOffCount / prevCount) * 100 : 0;
  }

  return funnel;
}

export async function getFlowPerformance(userId) {
  const flows = await prisma.flow.findMany({
    where: { account_id: userId },
    include: { leads: true }
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const performance = flows.map(flow => {
    const leads = flow.leads;
    const totalLeadsEntered = leads.length;
    let dmsSent = 0;
    let dmsOpened = 0;
    let emailsCaptured = 0;
    let conversions = 0;
    let totalScore = 0;
    let leadsThisWeek = 0;

    leads.forEach(lead => {
      dmsSent += lead.dmsSent > 0 ? 1 : 0;
      dmsOpened += lead.dmsOpened > 0 ? 1 : 0;
      if (lead.emailCaptured) emailsCaptured++;
      if (lead.stage === "converted") conversions++;
      totalScore += lead.score;
      if (lead.createdAt >= weekAgo) leadsThisWeek++;
    });

    const openRate = dmsSent > 0 ? dmsOpened / dmsSent : 0;
    const emailCaptureRate = totalLeadsEntered > 0 ? emailsCaptured / totalLeadsEntered : 0;
    const conversionRate = totalLeadsEntered > 0 ? conversions / totalLeadsEntered : 0;
    const avgLeadScore = totalLeadsEntered > 0 ? totalScore / totalLeadsEntered : 0;

    return {
      flowId: flow.id,
      flowName: flow.name,
      status: flow.status,
      totalLeadsEntered,
      dmsSent,
      openRate,
      emailCaptureRate,
      conversionRate,
      avgLeadScore,
      leadsThisWeek
    };
  });

  return performance.sort((a, b) => b.totalLeadsEntered - a.totalLeadsEntered);
}

export async function getPostPerformance(userId, limit = 10) {
  const leads = await prisma.lead.findMany({
    where: { userId, sourcePostId: { not: null } }
  });

  const postsMap = {};
  leads.forEach(lead => {
    const postId = lead.sourcePostId;
    if (!postsMap[postId]) {
      postsMap[postId] = { leadsGenerated: 0, dmsSent: 0, dmsOpened: 0, conversions: 0 };
    }
    postsMap[postId].leadsGenerated++;
    if (lead.dmsSent > 0) postsMap[postId].dmsSent++;
    if (lead.dmsOpened > 0) postsMap[postId].dmsOpened++;
    if (lead.stage === "converted") postsMap[postId].conversions++;
  });

  const result = Object.keys(postsMap).map(postId => {
    const stats = postsMap[postId];
    const openRate = stats.dmsSent > 0 ? stats.dmsOpened / stats.dmsSent : 0;
    const conversionRate = stats.leadsGenerated > 0 ? stats.conversions / stats.leadsGenerated : 0;
    
    return {
      postId,
      type: "Reel",
      caption: "Instagram Post snippet...",
      postUrl: `https://instagram.com/p/${postId}`,
      postThumbnail: "", 
      leadsGenerated: stats.leadsGenerated,
      dmsSent: stats.dmsSent,
      openRate,
      conversionRate
    };
  });

  return result.sort((a, b) => b.leadsGenerated - a.leadsGenerated).slice(0, limit);
}

export async function getLeadSourceBreakdown(userId, dateRange) {
  const { from, to } = dateRange;
  const leads = await prisma.lead.findMany({
    where: { userId, createdAt: { gte: from, lte: to } },
    select: { sourceTrigger: true }
  });

  const breakdown = {
    comment: 0,
    story_reply: 0,
    story_mention: 0,
    whatsapp: 0
  };

  leads.forEach(lead => {
    const t = lead.sourceTrigger || "comment";
    if (breakdown[t] !== undefined) breakdown[t]++;
  });

  return breakdown;
}

export async function getHourlyData(userId, dateRange) {
  const { from, to } = dateRange;
  const activities = await prisma.leadActivity.findMany({
    where: { 
      lead: { userId },
      createdAt: { gte: from, lte: to }
    },
    select: { createdAt: true }
  });

  const hourlyCounts = Array(24).fill(0);
  activities.forEach(act => {
    const hour = act.createdAt.getHours();
    hourlyCounts[hour]++;
  });

  return hourlyCounts.map((count, hour) => ({ hour, count }));
}

export async function getWeekdayData(userId, dateRange) {
  const { from, to } = dateRange;
  const leads = await prisma.lead.findMany({
    where: { userId, createdAt: { gte: from, lte: to } },
    select: { createdAt: true, stage: true }
  });

  const weekdayCounts = [
    { day: "Sun", count: 0, conversions: 0 },
    { day: "Mon", count: 0, conversions: 0 },
    { day: "Tue", count: 0, conversions: 0 },
    { day: "Wed", count: 0, conversions: 0 },
    { day: "Thu", count: 0, conversions: 0 },
    { day: "Fri", count: 0, conversions: 0 },
    { day: "Sat", count: 0, conversions: 0 },
  ];

  leads.forEach(lead => {
    const day = lead.createdAt.getDay();
    weekdayCounts[day].count++;
    if (lead.stage === 'converted') weekdayCounts[day].conversions++;
  });

  // Reorder to make Mon the first day, Sun the last day
  const monToSun = [...weekdayCounts.slice(1), weekdayCounts[0]];
  return monToSun;
}

export async function getCohortData(userId) {
  // Not used in UI yet, but returning basic structure
  return [];
}
