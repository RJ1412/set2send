import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../utils/db.js";
import { env } from "../config/env.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password_hash: hashedPassword,
        subscription: {
          create: {
            plan: "free",
            status: "active",
            dms_limit: 100,
          },
        },
        alert_config: {
          create: {}, // Defaults
        },
      },
    });

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
    const { token } = req.body;
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
        user = await prisma.user.create({
          data: {
            email,
            name,
            google_id: googleId,
            subscription: {
              create: {
                plan: "free",
                status: "active",
                dms_limit: 100,
              },
            },
            alert_config: {
              create: {}, // Defaults
            },
          },
        });
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
