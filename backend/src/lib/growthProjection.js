import { prisma } from "../utils/db.js";

function linearRegression(x, y) {
  const n = y.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
  const intercept = (sumY - slope * sumX) / n || 0;
  
  // R2 logic simple implementation
  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    const projectedY = slope * x[i] + intercept;
    ssTot += Math.pow(y[i] - meanY, 2);
    ssRes += Math.pow(y[i] - projectedY, 2);
  }
  const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);
  
  return { slope, intercept, r2 };
}

function standardDeviation(values) {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

function projectPoint(slope, intercept, x) {
  return Math.max(0, slope * x + intercept);
}

export async function projectGrowth(userId, daysAhead = 30) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const snapshots = await prisma.analyticsSnapshot.findMany({
    where: { userId, date: { gte: thirtyDaysAgo } },
    orderBy: { date: 'asc' }
  });

  const numDays = snapshots.length;
  let dataQuality = "insufficient";
  if (numDays >= 15) dataQuality = "good";
  else if (numDays >= 7) dataQuality = "limited";

  if (numDays === 0) {
    return {
      projections: null,
      dataQuality,
      message: "Not enough data to project."
    };
  }

  const x = Array.from({ length: numDays }, (_, i) => i);
  const newLeads = snapshots.map(s => s.newLeads);
  const emailsCaptured = snapshots.map(s => s.emailsCaptured);
  const conversions = snapshots.map(s => s.conversions);

  const calculateProjection = (yData, metricName) => {
    const { slope, intercept, r2 } = linearRegression(x, yData);
    
    // Calculate residuals for SD
    const residuals = yData.map((y, i) => y - (slope * i + intercept));
    const sd = standardDeviation(residuals);

    const current = yData.reduce((a, b) => a + b, 0);
    
    // Project ahead
    let projected30d = 0, projected60d = 0, projected90d = 0;
    const chartData = [];

    // Historical
    for (let i = 0; i < numDays; i++) {
      chartData.push({
        date: snapshots[i].date.toISOString(),
        actual: yData[i],
        projected: projectPoint(slope, intercept, i),
        lower: Math.max(0, projectPoint(slope, intercept, i) - sd),
        upper: projectPoint(slope, intercept, i) + sd
      });
    }

    // Future
    let futureCumulative30 = 0, futureCumulative60 = 0, futureCumulative90 = 0;
    const lastDate = new Date(snapshots[numDays - 1].date);
    for (let i = 1; i <= Math.max(daysAhead, 90); i++) {
      const futureX = numDays - 1 + i;
      const projY = projectPoint(slope, intercept, futureX);
      if (i <= 30) futureCumulative30 += projY;
      if (i <= 60) futureCumulative60 += projY;
      if (i <= 90) futureCumulative90 += projY;

      if (i <= daysAhead) {
        const d = new Date(lastDate);
        d.setDate(d.getDate() + i);
        chartData.push({
          date: d.toISOString(),
          projected: projY,
          lower: Math.max(0, projY - sd),
          upper: projY + sd
        });
      }
    }

    projected30d = Math.round(futureCumulative30);
    projected60d = Math.round(futureCumulative60);
    projected90d = Math.round(futureCumulative90);

    let trend = "flat";
    if (slope > 0.1) trend = "up";
    else if (slope < -0.1) trend = "down";

    let trendStrength = "weak";
    if (r2 > 0.7) trendStrength = "strong";
    else if (r2 > 0.4) trendStrength = "moderate";

    return {
      current,
      projected30d,
      projected60d,
      projected90d,
      trend,
      trendStrength,
      chartData
    };
  };

  const leadsProj = calculateProjection(newLeads, "leads");
  const emailsProj = calculateProjection(emailsCaptured, "emailCaptures");
  const conversionsProj = calculateProjection(conversions, "conversions");

  const avgRevenuePerConversion = 2000; // default in INR

  return {
    projections: {
      leads: leadsProj,
      emailCaptures: emailsProj,
      conversions: conversionsProj,
      estimatedMRRImpact: conversionsProj.projected30d * avgRevenuePerConversion
    },
    dataQuality
  };
}
