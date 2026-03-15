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

const FROM_ADDRESS = process.env.SMTP_USER || "noreply@mayr-dach.com";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "office@mayr-dach.com";

export async function sendApplicationNotification(application: {
  name: string;
  email: string;
  phone: string;
  position?: string | null;
  id: string;
}) {
  const adminUrl = `${process.env.BETTER_AUTH_URL}/admin/applications/${application.id}`;

  // 1. Notify office@mayr-dach.com about the new application
  const officeHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;">
      <div style="background:#8b1e23;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:white;margin:0;">Neue Bewerbung eingegangen</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Name:</td><td style="padding:6px 0;">${application.name}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">E-Mail:</td><td style="padding:6px 0;"><a href="mailto:${application.email}" style="color:#8b1e23;">${application.email}</a></td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Telefon:</td><td style="padding:6px 0;"><a href="tel:${application.phone}" style="color:#8b1e23;">${application.phone}</a></td></tr>
          ${application.position ? `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Position:</td><td style="padding:6px 0;">${application.position}</td></tr>` : ""}
        </table>
        <p style="margin-top:20px;">
          <a href="${adminUrl}" style="display:inline-block;background:#8b1e23;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">
            Bewerbung ansehen
          </a>
        </p>
      </div>
    </div>
  `;

  // 2. Send confirmation to the applicant
  const applicantHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;">
      <div style="background:#8b1e23;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:white;margin:0;">Vielen Dank für Ihre Bewerbung!</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
        <p style="color:#374151;line-height:1.6;">
          Sehr geehrte/r ${application.name},
        </p>
        <p style="color:#374151;line-height:1.6;">
          vielen Dank für Ihre Bewerbung${application.position ? ` als <strong>${application.position}</strong>` : ""} bei der Karl Mayr GmbH &amp; Co. KG.
        </p>
        <p style="color:#374151;line-height:1.6;">
          Wir haben Ihre Unterlagen erhalten und werden diese sorgfältig prüfen. Sie erhalten in Kürze eine Rückmeldung von uns.
        </p>
        <p style="color:#374151;line-height:1.6;">
          Bei Fragen stehen wir Ihnen gerne zur Verfügung.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="color:#6b7280;font-size:14px;line-height:1.5;">
          <strong>Karl Mayr GmbH &amp; Co. KG</strong><br />
          Dachdeckerei &middot; Spenglerei &middot; Glaserei<br />
          Leogangerstraße 55, 5760 Saalfelden<br />
          Tel: <a href="tel:+4365826248" style="color:#8b1e23;">+43 6582 6248</a><br />
          <a href="https://mayr-dach.com" style="color:#8b1e23;">www.mayr-dach.com</a>
        </p>
      </div>
    </div>
  `;

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Karl Mayr GmbH & Co. KG" <${FROM_ADDRESS}>`,
        to: NOTIFICATION_EMAIL,
        subject: `Neue Bewerbung: ${application.name}${application.position ? ` – ${application.position}` : ""}`,
        html: officeHtml,
      }),
      transporter.sendMail({
        from: `"Karl Mayr GmbH & Co. KG" <${FROM_ADDRESS}>`,
        to: application.email,
        subject: "Vielen Dank für Ihre Bewerbung – Karl Mayr GmbH & Co. KG",
        html: applicantHtml,
      }),
    ]);
    console.log(`Notification emails sent for application ${application.id}`);
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}
