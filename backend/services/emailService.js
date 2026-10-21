import nodemailer from "nodemailer";
import { waitUntil } from "@vercel/functions";
import "dotenv/config";
import {
  greetingTemplate,
  confirmationTemplate,
  rejectionTemplate,
  adminNotificationTemplate,
} from "./emailTemplates.js";

/* =========================================================
   Background dispatch — Vercel freezes functions after the
   response, so pending SMTP sends must be registered with
   waitUntil to actually complete. No-op-safe locally.
========================================================= */

export const background = (promise) => {
  try {
    waitUntil(promise);
  } catch {
    // Non-Vercel runtime: the process stays alive on its own.
  }
};

/* =========================================================
   SMTP config (Gmail App Password works out of the box)
========================================================= */

const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "").trim();
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 465;
const fromName = process.env.SMTP_FROM_NAME || "Shree Shyam Dental Care";
const fromAddress = (process.env.SMTP_FROM || smtpUser).trim();

export const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173")
).replace(/\/+$/, "");

export const isEmailEnabled = () => Boolean(smtpUser && smtpPass);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }
  return transporter;
};

// Fire-and-forget: a failed email must never break a booking.
const safeSend = async (label, mailOptions) => {
  if (!isEmailEnabled()) {
    console.log(`[email] skipped (${label}) — SMTP not configured`);
    return;
  }
  try {
    await getTransporter().sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      ...mailOptions,
    });
    console.log(`[email] sent: ${label}`);
  } catch (error) {
    console.error(`[email] failed (${label}):`, error.message);
  }
};

/* =========================================================
   Public senders
========================================================= */

export const sendGreetingEmail = ({ to, name, appointment }) =>
  safeSend("greeting", {
    to,
    subject: `Welcome to Shree Shyam Dental Care, ${name}!`,
    html: greetingTemplate({ name, appointment, siteUrl }),
  });

export const sendConfirmationEmail = ({ to, name, appointment }) =>
  safeSend("confirmation", {
    to,
    subject: `Your appointment is confirmed — Shree Shyam Dental Care`,
    html: confirmationTemplate({ name, appointment, siteUrl }),
  });

export const sendRejectionEmail = ({ to, name, appointment }) =>
  safeSend("rejection", {
    to,
    subject: `Appointment update — Shree Shyam Dental Care`,
    html: rejectionTemplate({ name, appointment, siteUrl }),
  });

export const sendAdminBookingNotification = ({ appointment }) => {
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
  if (!adminEmail) return Promise.resolve();
  return safeSend("admin-notify", {
    to: adminEmail,
    subject: `New appointment request from ${appointment.name}`,
    html: adminNotificationTemplate({ appointment }),
  });
};
