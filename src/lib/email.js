import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { serverEnv } from "@/lib/env";

const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

function hasSmtpConfig() {
  return Boolean(serverEnv.smtpHost && serverEnv.smtpUser && serverEnv.smtpPass);
}

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

  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

export function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  return {
    token,
    tokenHash,
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
}

export function buildVerificationUrl({ email, token, origin }) {
  const baseUrl = origin || serverEnv.appBaseUrl;
  const url = new URL("/verify-email", baseUrl);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

export function hashVerificationToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

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

  console.log("Fashion Mart verification email preview:", verificationUrl);

  return {
    mode: "dev-preview",
    previewUrl: verificationUrl,
    messageId: info.messageId,
  };
}
