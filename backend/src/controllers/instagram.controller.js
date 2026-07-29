import { env } from "../config/env.js";
import { prisma } from "../utils/db.js";
import axios from "axios";

export const connect = (req, res) => {
  const redirectUri = env.META_REDIRECT_URI;
  const state = req.userId; // pass user id in state
  const scope = "business_management,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_manage_metadata,pages_read_engagement,pages_messaging,pages_show_list";
  const authUrl = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${env.META_APP_ID}&display=page&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  
  res.json({ url: authUrl });
};

export const getAccounts = async (req, res, next) => {
  try {
    const accounts = await prisma.instagramAccount.findMany({
      where: { user_id: req.userId },
      select: { id: true, ig_username: true, status: true }
    });
    res.json(accounts);
  } catch (error) {
    next(error);
  }
};

export const exchangeToken = async (req, res) => {
  const { code, state: userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({ error: "Missing authorization code or user state" });
  }

  try {
    // 1. Exchange code for short-lived token using Graph API
    const tokenRes = await axios.get(`https://graph.facebook.com/v25.0/oauth/access_token`, {
      params: {
        client_id: env.META_APP_ID,
        client_secret: env.META_APP_SECRET,
        redirect_uri: env.META_REDIRECT_URI, // Must exactly match the frontend URL sent in .env
        code,
      }
    });

    const shortToken = tokenRes.data.access_token;

    // 2. Exchange for long-lived token
    const longTokenRes = await axios.get(`https://graph.facebook.com/v25.0/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: env.META_APP_ID,
        client_secret: env.META_APP_SECRET,
        fb_exchange_token: shortToken
      }
    });

    const longToken = longTokenRes.data.access_token;
    console.log("Successfully obtained long-lived token.");
    
    // 3. Get User info (Facebook Page)
    const meRes = await axios.get(`https://graph.facebook.com/v25.0/me/accounts`, {
      params: { access_token: longToken }
    });
    
    if (!meRes.data.data || meRes.data.data.length === 0) {
      throw new Error("No Facebook Pages found linked to this account.");
    }
    
    const page = meRes.data.data[0];
    const pageId = page.id;
    const pageAccessToken = page.access_token; // The critical Page Access Token
    console.log("Selected Facebook Page ID:", pageId);
    
    // 4. Get connected Instagram Business Account
    const igRes = await axios.get(`https://graph.facebook.com/v25.0/${pageId}?fields=instagram_business_account`, {
      params: { access_token: pageAccessToken }
    });

    if (!igRes.data.instagram_business_account) {
      throw new Error("No Instagram Business Account linked to the Facebook Page.");
    }

    const igUserId = igRes.data.instagram_business_account.id;
    
    // 5. Install the App on the Facebook Page (REQUIRED FOR WEBHOOKS)
    try {
      console.log("Installing App on Page for Webhooks...");
      await axios.post(`https://graph.facebook.com/v25.0/me/subscribed_apps`, null, {
        params: {
          subscribed_fields: "messages,feed",
          access_token: pageAccessToken
        }
      });
      console.log("App successfully installed on Page!");
    } catch (e) {
      console.error("Failed to install app on page:", e.response?.data || e.message);
    }

    // 6. Fetch IG Username (Optional, but good for UI)
    let igUsername = "Connected Account";
    try {
      const igProfileRes = await axios.get(`https://graph.facebook.com/v25.0/${igUserId}?fields=username`, {
        params: { access_token: pageAccessToken }
      });
      if (igProfileRes.data.username) igUsername = igProfileRes.data.username;
    } catch (e) {
      console.log("Failed to fetch IG username, using default.");
    }

    // 7. Save to DB (Store the PAGE Access Token, not the user token!)
    await prisma.instagramAccount.upsert({
      where: { ig_user_id: igUserId },
      update: {
        access_token: pageAccessToken,
        status: "active",
        user_id: userId,
        ig_username: igUsername,
      },
      create: {
        user_id: userId,
        ig_user_id: igUserId,
        ig_username: igUsername,
        access_token: pageAccessToken,
      }
    });

    res.json({
      success: true,
      access_token: pageAccessToken, // Return the active page token to frontend if they need it
      ig_username: igUsername,
      ig_user_id: igUserId
    });
  } catch (error) {
    console.error("Token exchange failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange token", details: error.response?.data });
  }
};

export const disconnect = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    
    // Delete account (cascade deletes campaigns)
    await prisma.instagramAccount.delete({
      where: { id: accountId, user_id: req.userId }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const health = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const account = await prisma.instagramAccount.findUnique({
      where: { id: accountId, user_id: req.userId }
    });

    if (!account) return res.status(404).json({ error: "Not found" });

    // In a real app we'd verify the token with Meta here.
    res.json({
      token_valid: true,
      webhook_active: true,
      dms_today: 0,
      status: account.status,
    });
  } catch (error) {
    next(error);
  }
};
