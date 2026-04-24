import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { serverEnv } from "@/lib/env";

/**
 * Email Service
 * Handles transactional email delivery using Nodemailer.
 * Supports SMTP for production and JSON/logging for development.
 */

const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Checks if the required SMTP configuration is present.
 */
function hasSmtpConfig() {
  return Boolean(serverEnv.smtpHost && serverEnv.smtpUser && serverEnv.smtpPass);
}

/**
 * Creates the Nodemailer transporter based on current environment settings.
 */
function createTransport() {
  if (hasSmtpConfig()) {
    return nodemailer.createTransport({
      host: serverEnv.smtpHost,
      port: serverEnv.smtpPort,
      secure: serverEnv.smtpPort === 465,
      auth: {
        user: serverEnv.smtpUser,
        pass: serverEnv.smtpPass,
      },
    });
  }

  // Development fallback: logs email content instead of sending
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

/**
 * Generates a secure random verification token and its hash for database storage.
 */
export function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  return {
    token,
    tokenHash,
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
}

/**
 * Constructs the absolute URL for email verification.
 */
export function buildVerificationUrl({ email, token, origin }) {
  const baseUrl = origin || serverEnv.appBaseUrl;
  const url = new URL("/verify-email", baseUrl);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 * Hashes a token for lookup/comparison in the database.
 */
export function hashVerificationToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Sends a stylized HTML verification email to a new user.
 */
export async function sendVerificationEmail({ email, name, verificationUrl }) {
  const transporter = createTransport();
  const from = `${serverEnv.smtpFromName} <${serverEnv.smtpFromEmail}>`;

  const info = await transporter.sendMail({
    from,
    to: email,
    replyTo: serverEnv.smtpFromEmail,
    headers: {
      "X-Entity-Ref-ID": crypto.randomUUID(),
    },
    subject: "Fashion Mart: Verify your email",
    text: `Hi ${name}, welcome to Fashion Mart. Verify your email by opening this link: ${verificationUrl}`,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;background:#f4f6f5;padding:32px;color:#111;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 16px 40px rgba(0,0,0,0.08);">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
            Verify your Fashion Mart email to activate your account.
          </div>
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#666;">Fashion Mart</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.05;text-transform:uppercase;">Verify your account</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#444;">
            Hi ${name}, thanks for signing up. Confirm your email to activate your account and continue into Fashion Mart.
          </p>
          <a href="${verificationUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">
            Verify Email
          </a>
          <p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#666;">
            If the button does not open, copy and paste this link into your browser:<br />
            <span style="word-break:break-all;">${verificationUrl}</span>
          </p>
        </div>
      </div>
    `,
  });

  if (hasSmtpConfig()) {
    return {
      mode: "smtp",
      messageId: info.messageId,
    };
  }

  // Console output for development when SMTP is not configured
  console.log("Fashion Mart verification email preview:", verificationUrl);

  return {
    mode: "dev-preview",
    previewUrl: verificationUrl,
    messageId: info.messageId,
  };
}

/**
 * Builds the HTML rows for each item in the order.
 */
function buildItemRows(items = []) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;line-height:1.5;">
          <strong>${item.title}</strong>
          ${item.size ? `<br/><span style="font-size:12px;color:#888;">Size: ${item.size}</span>` : ""}
          ${item.color ? `<span style="font-size:12px;color:#888;"> · Color: ${item.color}</span>` : ""}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center;width:50px;">
          ×${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:600;color:#111;text-align:right;white-space:nowrap;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");
}

/**
 * Sends a stylized HTML order confirmation email to the user.
 */
export async function sendOrderConfirmationEmail({ email, name, order }) {
  const transporter = createTransport();
  const from = `${serverEnv.smtpFromName} <${serverEnv.smtpFromEmail}>`;
  const itemRows = buildItemRows(order.items);

  const info = await transporter.sendMail({
    from,
    to: email,
    replyTo: serverEnv.smtpFromEmail,
    headers: {
      "X-Entity-Ref-ID": crypto.randomUUID(),
    },
    subject: `Fashion Mart: Order Confirmed #${order.transactionId}`,
    text: `Hi ${name}, your Fashion Mart order #${order.transactionId} has been confirmed. Total: $${order.total.toFixed(2)}`,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;background:#f4f6f5;padding:32px;color:#111;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 16px 40px rgba(0,0,0,0.08);">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
            Your Fashion Mart order #${order.transactionId} is confirmed.
          </div>

          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#666;">Fashion Mart</p>
          <h1 style="margin:0 0 8px;font-size:28px;line-height:1.1;text-transform:uppercase;">Order Confirmed!</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#444;">
            Hi ${name}, thanks for your purchase. Your order has been received and is being processed.
          </p>

          <!-- Transaction meta -->
          <div style="background:#f9f9f7;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Transaction ID</td>
                <td style="font-size:13px;font-weight:600;color:#111;text-align:right;font-family:monospace;">${order.transactionId}</td>
              </tr>
            </table>
          </div>

          <!-- Items table -->
          ${itemRows ? `
          <p style="margin:0 0 10px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Items Ordered</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            ${itemRows}
          </table>` : ""}

          <!-- Total -->
          <div style="background:#111;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#fff;">Order Total</td>
                <td style="font-size:18px;font-weight:700;color:#e6c744;text-align:right;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#999;text-align:center;">
            Questions? Reply to this email and we'll be happy to help.
          </p>
        </div>
      </div>
    `,
  });

  if (hasSmtpConfig()) {
    return { mode: "smtp", messageId: info.messageId };
  }

  console.log("Fashion Mart order confirmation preview:", order.transactionId);
  return { mode: "dev-preview", messageId: info.messageId };
}
