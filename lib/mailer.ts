/* Phase 7: Email service using Nodemailer */
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

/**
 * Reset transporter (for testing)
 */
export function resetMailTransporter(): void {
  transporter = null;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  inquiryType: string;
  message: string;
}

export interface InsightAnnouncementData {
  title: string;
  excerpt?: string | null;
  slug: string;
}

/**
 * Get or create Nodemailer transporter
 */
export function getMailTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error("SMTP configuration is incomplete. Please check environment variables.");
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Prevent indefinite hangs on misconfigured/slow SMTP endpoints.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporter;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getMailTransporter();
    const from = process.env.SMTP_FROM || "noreply@spx.com";
    const fromName = process.env.SMTP_FROM_NAME || "SPX";
    const formattedFrom = from.includes("<") && from.includes(">")
      ? from
      : `${fromName} <${from}>`;
    const sendMailPromise = transport.sendMail({
      from: formattedFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("SMTP send timed out")), 20000)
    );

    await Promise.race([sendMailPromise, timeoutPromise]);

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

/**
 * Send contact form submission email
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  const to = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "hello@spx.com";

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}` : ""}
${data.phone ? `Phone: ${data.phone}` : ""}
Inquiry Type: ${data.inquiryType}

Message:
${data.message}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #374151; margin-bottom: 5px; }
    .value { color: #1f2937; }
    .message-box { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      ${data.organization ? `
      <div class="field">
        <div class="label">Organization:</div>
        <div class="value">${data.organization}</div>
      </div>
      ` : ""}
      ${data.phone ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${data.phone}</div>
      </div>
      ` : ""}
      <div class="field">
        <div class="label">Inquiry Type:</div>
        <div class="value">${data.inquiryType}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${data.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `New Contact Inquiry: ${data.inquiryType}`,
    text,
    html,
  });
}

/**
 * Send confirmation email to user
 */
export async function sendContactConfirmation(data: ContactFormData): Promise<boolean> {
  const text = `
Dear ${data.name},

Thank you for reaching out to SPX. We've received your inquiry regarding "${data.inquiryType}" and will respond within 1-2 business days.

For urgent matters, please contact us directly at ${process.env.CONTACT_TO_EMAIL || "hello@spx.com"}.

Best regards,
The SPX Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">SPX</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>Thank you for reaching out to SPX. We've received your inquiry regarding <strong>"${data.inquiryType}"</strong> and will respond within 1-2 business days.</p>
      <p>For urgent matters, please contact us directly at <a href="mailto:${process.env.CONTACT_TO_EMAIL || "hello@spx.com"}" style="color: #00BFFF;">${process.env.CONTACT_TO_EMAIL || "hello@spx.com"}</a>.</p>
      <p>Best regards,<br>The SPX Team</p>
    </div>
    <div class="footer">
      This is an automated confirmation. Please do not reply to this email.
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: data.email,
    subject: "Thank you for contacting SPX",
    text,
    html,
  });
}

/**
 * Verify SMTP configuration
 */
export async function verifyMailConfig(): Promise<boolean> {
  try {
    const transport = getMailTransporter();
    await transport.verify();
    return true;
  } catch (error) {
    console.error("SMTP verification failed:", error);
    return false;
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendNewsletterWelcome(email: string, unsubscribeToken: string): Promise<boolean> {
  const contactEmail = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "hello@spx.com";
  const appUrl = (process.env.APP_URL || "http://localhost:3002").replace(/\/$/, "");
  const unsubscribeUrl = `${appUrl}/newsletter/unsubscribe/${encodeURIComponent(unsubscribeToken)}`;
  const text = `
You are now subscribed to SPX Insights.

We will notify you when new insights are published.

For support, contact ${contactEmail}.

Unsubscribe anytime: ${unsubscribeUrl}

SPX Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">SPX</h1>
    </div>
    <div class="content">
      <p>You are now subscribed to <strong>SPX Insights</strong>.</p>
      <p>We will notify you when new insights are published.</p>
      <p><a href="${unsubscribeUrl}">Unsubscribe from these updates</a></p>
      <p class="footer">For support, contact <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: email,
    subject: "You are subscribed to SPX Insights",
    text,
    html,
  });
}

export async function sendInsightAnnouncement(
  to: string,
  insight: InsightAnnouncementData,
  unsubscribeToken: string
): Promise<boolean> {
  const appUrl = process.env.APP_URL || "http://localhost:3002";
  const insightUrl = `${appUrl.replace(/\/$/, "")}/insights/${insight.slug}`;
  const unsubscribeUrl = `${appUrl.replace(/\/$/, "")}/newsletter/unsubscribe/${encodeURIComponent(unsubscribeToken)}`;
  const safeTitle = escapeHtml(insight.title);
  const safeExcerpt = insight.excerpt ? escapeHtml(insight.excerpt) : "";

  const text = `
New SPX insight published:
${insight.title}

Read it: ${insightUrl}

${insight.excerpt || ""}

Unsubscribe: ${unsubscribeUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; margin-top: 16px; background: #111827; color: white !important; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New SPX Insight</h1>
    </div>
    <div class="content">
      <h2 style="margin-top: 0;">${safeTitle}</h2>
      ${safeExcerpt ? `<p>${safeExcerpt}</p>` : ""}
      <a class="btn" href="${insightUrl}">Read the full insight</a>
      <p style="margin-top: 18px; color: #6b7280; font-size: 14px;">If the button does not work, use this link: ${insightUrl}</p>
      <p style="margin-top: 12px; color: #6b7280; font-size: 14px;"><a href="${unsubscribeUrl}">Unsubscribe from future insight emails</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to,
    subject: `New Insight: ${insight.title}`,
    text,
    html,
  });
}
