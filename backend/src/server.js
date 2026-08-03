import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { prisma } from "./utils/db.js";
import { dmQueue } from "./queues/dmQueue.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import instagramRoutes from "./routes/instagram.routes.js";
import campaignsRoutes from "./routes/campaigns.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import flowsRoutes from "./routes/flows.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import crmRoutes from "./routes/crm.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// Initialize the background workers
import "./jobs/dmWorker.js"; // Initialize the background worker
import "./queues/followUpQueue.js";
import { initSilentRecheckPoller } from "./queues/silentRecheckQueue.js";
import "./jobs/silentRecheckWorker.js"; // Initialize the silent recheck worker
import "./jobs/whatsappBulkWorker.js"; // Initialize the WhatsApp bulk worker
import { setupCrmCronJobs } from "./jobs/crmJobs.js";

// Initialize the queue scheduling
initSilentRecheckPoller().catch(console.error);
setupCrmCronJobs().catch(console.error);

const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(helmet({
  crossOriginOpenerPolicy: false
}));
app.use(cors({
  origin: [env.FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
}));

// We need raw body for Meta and Razorpay webhooks before parsing JSON
app.use("/webhooks/meta", express.raw({ type: "application/json" }));
app.use("/api/billing/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Healthcheck
app.get("/health", async (req, res) => {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;

    // Check Queues
    const dmQueueWaiting = await dmQueue.getWaitingCount();
    const dmQueueActive = await dmQueue.getActiveCount();
    const dmQueueFailed = await dmQueue.getFailedCount();

    res.json({
      status: "ok",
      database: "connected",
      queues: {
        dm_queue: {
          waiting: dmQueueWaiting,
          active: dmQueueActive,
          failed: dmQueueFailed
        }
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Healthcheck failed:", error);
    res.status(503).json({
      status: "error",
      message: "Service unavailable",
      error: error.message
    });
  }
});

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/auth/instagram", instagramRoutes); // Route Meta callbacks to the correct controller
app.use("/api/campaigns", campaignsRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/api/billing", billingRoutes);
app.use("/r", trackingRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/flows", flowsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
