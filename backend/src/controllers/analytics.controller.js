import { getDashboardMetrics, getTimeSeriesData, getFunnelData, getFlowPerformance, getPostPerformance, getLeadSourceBreakdown, getHourlyData, getWeekdayData, getCohortData } from "../lib/analyticsEngine.js";
import { projectGrowth } from "../lib/growthProjection.js";
import { generateSuggestions } from "../lib/geminiSuggestions.js";
import { redis } from "../utils/redis.js";

const getCachedOrCompute = async (key, ttl, computeFn) => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const result = await computeFn();
  await redis.set(key, JSON.stringify(result), "EX", ttl);
  return result;
};

export const dashboardMetrics = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:dashboard:${req.userId}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    
    const result = await getCachedOrCompute(key, 600, () => getDashboardMetrics(req.userId, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error dashboardMetrics:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const timeseries = async (req, res) => {
  try {
    const { metric, granularity, from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:timeseries:${req.userId}:${metric}:${granularity}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    
    const result = await getCachedOrCompute(key, 600, () => getTimeSeriesData(req.userId, metric, granularity, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error timeseries:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const funnel = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:funnel:${req.userId}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    
    const result = await getCachedOrCompute(key, 600, () => getFunnelData(req.userId, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error funnel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const flows = async (req, res) => {
  try {
    const key = `analytics:flows:${req.userId}`;
    const result = await getCachedOrCompute(key, 600, () => getFlowPerformance(req.userId));
    res.json(result);
  } catch (error) {
    console.error("Error flows:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const posts = async (req, res) => {
  try {
    const key = `analytics:posts:${req.userId}`;
    const result = await getCachedOrCompute(key, 600, () => getPostPerformance(req.userId));
    res.json(result);
  } catch (error) {
    console.error("Error posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const sources = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:sources:${req.userId}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    
    const result = await getCachedOrCompute(key, 600, () => getLeadSourceBreakdown(req.userId, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error sources:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const projection = async (req, res) => {
  try {
    const { daysAhead = 30 } = req.query;
    const key = `analytics:projection:${req.userId}`;
    const result = await getCachedOrCompute(key, 3600, () => projectGrowth(req.userId, parseInt(daysAhead)));
    res.json(result);
  } catch (error) {
    console.error("Error projection:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const suggestions = async (req, res) => {
  try {
    const { forceRefresh } = req.query;
    const result = await generateSuggestions(req.userId, forceRefresh === "true");
    res.json(result);
  } catch (error) {
    console.error("Error suggestions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const hourly = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:hourly:${req.userId}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    const result = await getCachedOrCompute(key, 600, () => getHourlyData(req.userId, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error hourly:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const weekday = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateRange = { from: new Date(from || Date.now() - 30 * 86400000), to: new Date(to || Date.now()) };
    const key = `analytics:weekday:${req.userId}:${dateRange.from.toISOString()}_${dateRange.to.toISOString()}`;
    const result = await getCachedOrCompute(key, 600, () => getWeekdayData(req.userId, dateRange));
    res.json(result);
  } catch (error) {
    console.error("Error weekday:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const cohort = async (req, res) => {
  try {
    const key = `analytics:cohort:${req.userId}`;
    const result = await getCachedOrCompute(key, 600, () => getCohortData(req.userId));
    res.json(result);
  } catch (error) {
    console.error("Error cohort:", error);
    res.status(500).json({ error: "Server error" });
  }
};
