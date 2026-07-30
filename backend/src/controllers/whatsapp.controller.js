import multer from "multer";
import axios from "axios";
import { parse } from "csv-parse/sync";
import { prisma } from "../utils/db.js";
import { addWhatsappBulkJob } from "../queues/whatsappBulkQueue.js";
import { env } from "../config/env.js";

const upload = multer({ storage: multer.memoryStorage() });

export const parseCsv = [
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const records = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const valid = [];
      const invalid = [];

      records.forEach((row, index) => {
        const rawPhone = row.phone || row.Phone || row.PHONE || "";
        const name = row.name || row.Name || row.NAME || null;
        
        // Strip spaces, dashes, parentheses
        let normalizedPhone = rawPhone.replace(/[\s\-\(\)]/g, "");
        
        // Validation: 10-15 digits, optionally starting with +
        // For Meta API, we usually want to remove the + if it exists and just send digits
        if (normalizedPhone.startsWith("+")) {
          normalizedPhone = normalizedPhone.substring(1);
        }

        const isValidPhone = /^[0-9]{10,15}$/.test(normalizedPhone);

        if (!rawPhone) {
          invalid.push({ row: index + 2, phone: rawPhone, reason: "Missing phone number" });
        } else if (!isValidPhone) {
          invalid.push({ row: index + 2, phone: rawPhone, reason: "Invalid phone format (must be 10-15 digits with country code)" });
        } else {
          valid.push({ name, phone: normalizedPhone });
        }
      });

      res.json({
        valid,
        invalid,
        total: records.length,
      });
    } catch (error) {
      console.error("[parseCsv error]", error);
      res.status(500).json({ error: "Failed to parse CSV file" });
    }
  },
];

export const createCampaign = async (req, res) => {
  try {
    const { name, messageType, templateName, templateParams, freeformBody, contacts } = req.body;
    const userId = req.userId;

    if (!name || !messageType || !contacts || !contacts.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (messageType === "template" && !templateName) {
      return res.status(400).json({ error: "Template name is required for template messages" });
    }

    if (messageType === "freeform" && !freeformBody) {
      return res.status(400).json({ error: "Body is required for freeform messages" });
    }

    const campaign = await prisma.whatsappCampaign.create({
      data: {
        userId,
        name,
        messageType,
        templateName,
        templateParams: templateParams ? JSON.stringify(templateParams) : null,
        freeformBody,
        status: "draft",
        totalRecipients: contacts.length,
      },
    });

    const logsData = contacts.map((contact) => ({
      campaignId: campaign.id,
      phone: contact.phone,
      name: contact.name,
      status: "queued",
    }));

    await prisma.whatsappLog.createMany({
      data: logsData,
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error("[createCampaign error]", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.whatsappCampaign.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const wabaId = env.WHATSAPP_BUSINESS_ACCOUNT_ID || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    const accessToken = env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    
    if (!wabaId || !accessToken) {
      return res.status(400).json({ error: "WhatsApp credentials not configured" });
    }

    const response = await axios.get(`https://graph.facebook.com/v19.0/${wabaId}/message_templates?access_token=${accessToken}`);
    
    // Filter for approved templates
    const templates = response.data.data.filter(t => t.status === "APPROVED");
    
    res.json(templates);
  } catch (error) {
    const metaError = error?.response?.data?.error;
    console.error("[getTemplates error]", metaError || error);
    
    if (metaError?.code === 190) {
      return res.status(401).json({ error: "WhatsApp Access Token has expired or is invalid. Please update your .env file." });
    }
    
    res.status(500).json({ error: metaError?.message || "Failed to fetch templates from Meta" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await prisma.whatsappCampaign.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    await prisma.whatsappCampaign.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("[deleteCampaign error]", error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

export const getCampaign = async (req, res) => {
  try {
    const campaign = await prisma.whatsappCampaign.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

export const getCampaignLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.whatsappLog.findMany({
        where: { campaignId: req.params.id },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.whatsappLog.count({
        where: { campaignId: req.params.id },
      }),
    ]);

    res.json({ logs, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

export const sendCampaign = async (req, res) => {
  try {
    const campaign = await prisma.whatsappCampaign.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    if (campaign.status !== "draft") {
      return res.status(400).json({ error: "Campaign is already running or completed" });
    }

    await prisma.whatsappCampaign.update({
      where: { id: campaign.id },
      data: { status: "running" },
    });

    const queuedLogs = await prisma.whatsappLog.findMany({
      where: { campaignId: campaign.id, status: "queued" },
    });

    for (const log of queuedLogs) {
      await addWhatsappBulkJob({
        logId: log.id,
        campaignId: campaign.id,
        phone: log.phone,
        name: log.name,
        messageType: campaign.messageType,
        templateName: campaign.templateName,
        templateParams: campaign.templateParams ? JSON.parse(campaign.templateParams) : null,
        freeformBody: campaign.freeformBody,
        accessToken: env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN,
        phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID,
      });
    }

    res.json({ message: "Campaign started", jobsQueued: queuedLogs.length });
  } catch (error) {
    console.error("[sendCampaign error]", error);
    res.status(500).json({ error: "Failed to start campaign" });
  }
};

export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const expectedToken = env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === expectedToken) {
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }
  return res.sendStatus(400);
};

export const handleWebhook = async (req, res) => {
  // Always acknowledge immediately
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const statusObj = value?.statuses?.[0];

    if (statusObj) {
      const waMessageId = statusObj.id;
      const status = statusObj.status; // sent, delivered, read, failed

      if (waMessageId && status) {
        let updateData = { status };

        if (status === "failed" && statusObj.errors && statusObj.errors.length > 0) {
          const waError = statusObj.errors[0];
          updateData.errorCode = waError.code?.toString();
          updateData.errorMessage = waError.title || waError.message || "Unknown error";
        }

        await prisma.whatsappLog.updateMany({
          where: { waMessageId },
          data: updateData,
        });
      }
    }

    // Check for incoming messages to trigger auto-retry for failed free-form campaigns
    const messages = value?.messages;
    if (messages && messages.length > 0) {
      const incomingMessage = messages[0];
      const fromPhone = incomingMessage.from;

      if (fromPhone) {
        // Find failed messages blocked by the 24-hour rule (Meta error 131047)
        const failedLogs = await prisma.whatsappLog.findMany({
          where: {
            phone: fromPhone,
            status: "failed",
            errorCode: "131047"
          },
          include: { campaign: true }
        });

        if (failedLogs.length > 0) {
          console.log(`[WhatsApp Webhook] User ${fromPhone} replied. Auto-retrying ${failedLogs.length} failed messages...`);
          
          for (const log of failedLogs) {
            // Update status back to queued
            await prisma.whatsappLog.update({
              where: { id: log.id },
              data: {
                status: "queued",
                errorCode: null,
                errorMessage: null
              }
            });

            // Re-add to the BullMQ queue
            await addWhatsappBulkJob({
              logId: log.id,
              campaignId: log.campaignId,
              phone: log.phone,
              name: log.name,
              messageType: log.campaign.messageType,
              templateName: log.campaign.templateName,
              templateParams: log.campaign.templateParams,
              freeformBody: log.campaign.freeformBody,
              accessToken: env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN,
              phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("[WhatsApp Webhook Processing Error]", error);
  }
};
