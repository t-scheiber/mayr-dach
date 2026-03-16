import { NextRequest, NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { contactSchema, getContactMessages } from "@/lib/contact-schema";
import type { ContactLocale } from "@/lib/contact-schema";

export async function POST(request: NextRequest) {
  let locale: ContactLocale = "de";

  try {
    const body = await request.json();
    locale = body.locale === "en" ? "en" : "de";

    const result = contactSchema(locale).safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return NextResponse.json({ fieldErrors }, { status: 400 });
    }

    const { name, email, phone, message } = result.data;

    // Send email notifications (non-blocking)
    sendContactNotification({
      name,
      email,
      phone: phone || undefined,
      message,
      locale,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission error:", error);
    const t = getContactMessages(locale);
    return NextResponse.json({ error: t.serverError }, { status: 500 });
  }
}
