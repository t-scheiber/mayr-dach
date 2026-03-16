import nodemailer from "nodemailer";
import { createMagicLinkUrl } from "./magic-link";

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

// ── Shared email wrapper ──────────────────────────────────────────────
function emailShell(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#8b1e23;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:white;margin:0;">${title}</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
        ${body}
      </div>
    </div>
  `;
}

function companySignature() {
  return `
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
    <p style="color:#6b7280;font-size:14px;line-height:1.5;">
      <strong>Karl Mayr GmbH &amp; Co. KG</strong><br />
      Dachdeckerei &middot; Spenglerei &middot; Glaserei<br />
      Georg-Scherer-Straße 6, 5760 Saalfelden<br />
      Tel: <a href="tel:+4365827336" style="color:#8b1e23;">+43 6582 73366</a><br />
      <a href="https://www.mayr-dach.at" style="color:#8b1e23;">www.mayr-dach.at</a>
    </p>
  `;
}

// ── OTP login email ───────────────────────────────────────────────────
export async function sendOTPEmail({ email, otp }: { email: string; otp: string }) {
  const html = emailShell(
    "Ihr Anmeldecode",
    `
      <p style="color:#374151;line-height:1.6;">
        Verwenden Sie den folgenden Code, um sich anzumelden:
      </p>
      <div style="margin:24px 0;text-align:center;">
        <span style="display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;padding:16px 32px;background:#f9fafb;border:2px solid #e5e7eb;border-radius:8px;color:#1f2937;">
          ${otp}
        </span>
      </div>
      <p style="color:#6b7280;font-size:14px;line-height:1.6;">
        Der Code ist 5 Minuten gültig. Falls Sie diese Anmeldung nicht angefordert haben, können Sie diese E-Mail ignorieren.
      </p>
    `
  );

  try {
    await transporter.sendMail({
      from: `"Karl Mayr GmbH & Co. KG" <${FROM_ADDRESS}>`,
      to: email,
      subject: `${otp} – Ihr Anmeldecode`,
      html,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
}

// ── Contact form emails ───────────────────────────────────────────────
export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: "de" | "en";
}) {
  const isEn = contact.locale === "en";

  const officeHtml = emailShell(
    "Neue Kontaktanfrage",
    `
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Name:</td><td style="padding:6px 0;">${contact.name}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">E-Mail:</td><td style="padding:6px 0;"><a href="mailto:${contact.email}" style="color:#8b1e23;">${contact.email}</a></td></tr>
        ${contact.phone ? `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Telefon:</td><td style="padding:6px 0;"><a href="tel:${contact.phone}" style="color:#8b1e23;">${contact.phone}</a></td></tr>` : ""}
        <tr><td style="padding:6px 12px 6px 0;font-weight:bold;color:#6b7280;">Sprache:</td><td style="padding:6px 0;">${isEn ? "Englisch" : "Deutsch"}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb;">
        <p style="margin:0 0 4px;font-weight:bold;color:#6b7280;font-size:13px;">Nachricht:</p>
        <p style="margin:0;color:#374151;line-height:1.6;white-space:pre-wrap;">${contact.message}</p>
      </div>
    `
  );

  const confirmationHtml = emailShell(
    isEn ? "Thank you for your message!" : "Vielen Dank für Ihre Nachricht!",
    isEn
      ? `
        <p style="color:#374151;line-height:1.6;">
          Dear ${contact.name},
        </p>
        <p style="color:#374151;line-height:1.6;">
          Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
        </p>
        <p style="color:#374151;line-height:1.6;">
          For urgent matters, you can also reach us by phone at
          <a href="tel:+4365827336" style="color:#8b1e23;">+43 6582 73366</a>.
        </p>
        ${companySignature()}
      `
      : `
        <p style="color:#374151;line-height:1.6;">
          Sehr geehrte/r ${contact.name},
        </p>
        <p style="color:#374151;line-height:1.6;">
          vielen Dank für Ihre Kontaktaufnahme. Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.
        </p>
        <p style="color:#374151;line-height:1.6;">
          Bei dringenden Anliegen erreichen Sie uns auch telefonisch unter
          <a href="tel:+4365827336" style="color:#8b1e23;">+43 6582 73366</a>.
        </p>
        ${companySignature()}
      `
  );

  const confirmationSubject = isEn
    ? "Thank you for your message – Karl Mayr GmbH & Co. KG"
    : "Vielen Dank für Ihre Nachricht – Karl Mayr GmbH & Co. KG";

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Karl Mayr GmbH & Co. KG" <${FROM_ADDRESS}>`,
        to: NOTIFICATION_EMAIL,
        subject: `Neue Kontaktanfrage: ${contact.name}`,
        html: officeHtml,
      }),
      transporter.sendMail({
        from: `"Karl Mayr GmbH & Co. KG" <${FROM_ADDRESS}>`,
        to: contact.email,
        subject: confirmationSubject,
        html: confirmationHtml,
      }),
    ]);
    console.log(`Contact notification emails sent for ${contact.email}`);
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }
}

// ── Application form emails ───────────────────────────────────────────
export async function sendApplicationNotification(application: {
  name: string;
  email: string;
  phone: string;
  position?: string | null;
  id: string;
}) {
  const adminPath = `/admin/applications/${application.id}`;
  const adminUrl = createMagicLinkUrl(NOTIFICATION_EMAIL, adminPath);

  const officeHtml = emailShell(
    "Neue Bewerbung eingegangen",
    `
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
    `
  );

  const applicantHtml = emailShell(
    "Vielen Dank für Ihre Bewerbung!",
    `
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
      ${companySignature()}
    `
  );

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
