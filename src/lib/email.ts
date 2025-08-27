import nodemailer from "nodemailer";

export type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

export function getTransport() {
  const host = process.env.SMTP_HOST ?? "localhost";
  const port = Number(process.env.SMTP_PORT ?? 1025);
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASS ?? "";

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendEmail(payload: EmailPayload) {
  const transporter = getTransport();
  const from = payload.from ?? "Admin <no-reply@local>";
  const info = await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
  return info;
} 