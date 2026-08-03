import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../utils/db.js";
import { env } from "../config/env.js";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/mailer.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expires_at: expiresAt },
      create: { email, otp, expires_at: expiresAt }
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, fullName, referral_code, otp } = req.body;
    const userName = name || fullName;
    if (!email || !password || !userName || !otp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otpRecord = await prisma.otpVerification.findUnique({ where: { email } });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (new Date() > otpRecord.expires_at) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await prisma.otpVerification.delete({ where: { email } });

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferralCode = crypto.randomBytes(4).toString("hex");

    let referrer = null;
    if (referral_code) {
      referrer = await prisma.user.findUnique({ where: { referral_code } });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: userName,
        password_hash: hashedPassword,
        referral_code: generatedReferralCode,
        referred_by_code: referrer ? referral_code : null,
        subscription: {
          create: {
            plan: "free",
            plan_key: "free",
            status: "active" // kept for backward compat with other systems
          },
        },
        alert_config: {
          create: {}, // Defaults
        },
        coin_ledger_entries: {
          create: { delta: 100, reason: "welcome_bonus", balance_after: 100 },
        },
      },
    });

    if (referrer && referrer.id !== user.id) {
      await prisma.referral.create({
        data: {
          referrer_id: referrer.id,
          referred_user_id: user.id,
          status: "pending",
        }
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

    jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid refresh token" });

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
      
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true });
};

import axios from "axios";

export const googleLogin = async (req, res, next) => {
  try {
    const { token, referral_code } = req.body;
    if (!token) return res.status(400).json({ error: "Missing Google token" });

    // Fetch user profile from Google using the access_token
    const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { sub: googleId, email, name } = profile;

    // Check if user exists by googleId
    let user = await prisma.user.findUnique({ where: { google_id: googleId } });

    if (!user) {
      // Check if user exists by email (if they registered with email before)
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        // Link google account to existing user
        user = await prisma.user.update({
          where: { email },
          data: { google_id: googleId },
        });
      } else {
        // Create new user
        const generatedReferralCode = crypto.randomBytes(4).toString("hex");

        let referrer = null;
        if (referral_code) {
          referrer = await prisma.user.findUnique({ where: { referral_code } });
        }

        user = await prisma.user.create({
          data: {
            email,
            name: userName,
            google_id: googleId,
            referral_code: generatedReferralCode,
            referred_by_code: referrer ? referral_code : null,
            subscription: {
              create: {
                plan: "free",
            plan_key: "free",
            status: "active"
              },
            },
            alert_config: {
              create: {}, // Defaults
            },
        coin_ledger_entries: {
          create: { delta: 100, reason: "welcome_bonus", balance_after: 100 },
        },
          },
        });

        if (referrer && referrer.id !== user.id) {
          await prisma.referral.create({
            data: {
              referrer_id: referrer.id,
              referred_user_id: user.id,
              status: "pending",
            }
          });
        }
      }
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, plan: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};






