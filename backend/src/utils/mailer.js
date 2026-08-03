import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Setup transporter with standard env vars or fallback to a test ethereal account
const transporterOptions = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
  secure: env.SMTP_SECURE === 'true',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

const transporter = nodemailer.createTransport(transporterOptions);

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"set2send" <${env.SENDER_EMAIL || env.SMTP_USER || 'noreply@set2send.io'}>`,
    to,
    subject: 'Your Verification Code for set2send',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F6; padding: 20px; border-radius: 10px; border: 1px solid #E8E4D9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1A1A1A; font-family: Georgia, serif; font-weight: 900; letter-spacing: -1px;">
            <span style="display: inline-block; width: 32px; height: 32px; background-color: #D4AF37; color: white; border-radius: 8px; line-height: 32px; text-align: center; margin-right: 8px;">S</span>
            set2send
          </h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #E8E4D9; text-align: center;">
          <h2 style="color: #1A1A1A; margin-top: 0;">Verify your email</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            You recently signed up or requested to verify your email for set2send. 
            Use the verification code below to complete the process.
          </p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #D4AF37; background-color: #FAF9F6; padding: 15px 20px; border-radius: 8px; border: 1px dashed #D4AF37;">
              ${otp}
            </span>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 11px;">
          &copy; ${new Date().getFullYear()} set2send. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.warn("SMTP credentials not provided! Logging OTP instead.");
      console.log("=========================================");
      console.log(`[DEVELOPMENT] OTP for ${to} is ${otp}`);
      console.log("=========================================");
      return;
    }
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send OTP email");
  }
};
