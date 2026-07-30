import { prisma } from "../utils/db.js";
import axios from "axios";

export const getCampaigns = async (req, res, next) => {
  try {
    const accounts = await prisma.instagramAccount.findMany({
      where: { user_id: req.userId },
      select: { id: true }
    });
    const accountIds = accounts.map(a => a.id);

    const campaigns = await prisma.campaign.findMany({
      where: { instagram_account_id: { in: accountIds } },
      orderBy: { created_at: "desc" },
    });

    res.json(campaigns);
  } catch (err) {
    next(err);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    let { 
      instagram_account_id, trigger_type, ig_media_id, ig_media_url, keyword, fuzzy_match, dm_template,
      require_follow, follow_message, collect_email, email_prompt_message, follow_up_message, follow_up_time_hours,
      retrigger_mode, retrigger_days, returning_dm_template
    } = req.body;

    const account = await prisma.instagramAccount.findUnique({
      where: { id: instagram_account_id, user_id: req.userId }
    });

    if (!account) return res.status(403).json({ error: "Invalid account" });

    // Meta Webhooks return numeric Media IDs, but the frontend sends shortcodes from URLs
    if (ig_media_id !== "ALL_POSTS" && isNaN(ig_media_id)) {
      try {
        const mediaRes = await axios.get(`https://graph.facebook.com/v25.0/${account.ig_user_id}/media`, {
          params: {
            fields: "id,shortcode",
            access_token: account.access_token,
            limit: 50
          }
        });
        
        const mediaList = mediaRes.data.data || [];
        const found = mediaList.find(m => m.shortcode === ig_media_id);
        
        if (found) {
          ig_media_id = found.id;
        } else {
          return res.status(400).json({ error: "Could not find that post on your recent Instagram feed. Please make sure the URL is correct." });
        }
      } catch (err) {
        console.error("Failed to resolve shortcode", err.response?.data || err.message);
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        instagram_account_id,
        trigger_type,
        ig_media_id,
        ig_media_url,
        keyword,
        fuzzy_match,
        dm_template,
        require_follow, follow_message, collect_email, email_prompt_message, follow_up_message, follow_up_time_hours,
        retrigger_mode, retrigger_days, returning_dm_template
      }
    });

    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
};

export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        instagram_account: true,
      }
    });

    if (!campaign || campaign.instagram_account.user_id !== req.userId) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(campaign);
  } catch (err) {
    next(err);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const { 
      status, keyword, dm_template,
      require_follow, follow_message, collect_email, email_prompt_message, follow_up_message, follow_up_time_hours,
      retrigger_mode, retrigger_days, returning_dm_template
    } = req.body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { instagram_account: true }
    });

    if (!campaign || campaign.instagram_account.user_id !== req.userId) {
      return res.status(404).json({ error: "Not found" });
    }

    const updated = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { 
        status, keyword, dm_template,
        require_follow, follow_message, collect_email, email_prompt_message, follow_up_message, follow_up_time_hours,
        retrigger_mode, retrigger_days, returning_dm_template
      }
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { instagram_account: true }
    });

    if (!campaign || campaign.instagram_account.user_id !== req.userId) {
      return res.status(404).json({ error: "Not found" });
    }

    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getCampaignLogs = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { instagram_account: true }
    });

    if (!campaign || campaign.instagram_account.user_id !== req.userId) {
      return res.status(404).json({ error: "Not found" });
    }

    const logs = await prisma.dmLog.findMany({
      where: { campaign_id: req.params.id },
      orderBy: { commented_at: "desc" },
      take: 50,
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getCampaignEmails = async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: { instagram_account: true }
    });

    if (!campaign || campaign.instagram_account.user_id !== req.userId) {
      return res.status(404).json({ error: "Not found" });
    }

    const emails = await prisma.collectedEmail.findMany({
      where: { campaign_id: req.params.id },
      orderBy: { created_at: "desc" },
    });

    res.json(emails);
  } catch (err) {
    next(err);
  }
};
