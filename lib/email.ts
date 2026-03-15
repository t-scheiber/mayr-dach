import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendApplicationNotification(application: {
  name: string;
  email: string;
  phone: string;
  position?: string | null;
  id: string;
}) {
  const adminUrl = `${process.env.BETTER_AUTH_URL}/admin/applications/${application.id}`;

  const html = `
    <h2>Neue Bewerbung eingegangen</h2>
    <table style="border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name:</td><td>${application.name}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">E-Mail:</td><td>${application.email}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Telefon:</td><td>${application.phone}</td></tr>
      ${application.position ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Position:</td><td>${application.position}</td></tr>` : ""}
    </table>
    <p style="margin-top:16px;">
      <a href="${adminUrl}" style="background:#8b1e23;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">
        Bewerbung ansehen
      </a>
    </p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Neue Bewerbung: ${application.name}`,
      html,
    });
    console.log(`Notification email sent for application ${application.id}`);
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}
