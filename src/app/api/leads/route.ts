import { NextRequest, NextResponse } from "next/server";
import { saveLead, getLeads } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Honeypot Anti-Spam Check
    if (data.website_hp && data.website_hp.trim() !== "") {
      // Bot detected, silently reject with fake success
      return NextResponse.json({ success: true, message: "Received" }, { status: 200 });
    }

    // 2. Validate Phone-First required fields
    if (!data.phone || data.phone.trim().length < 8) {
      return NextResponse.json(
        { error: "A valid phone number is required so our agronomists can reach you." },
        { status: 400 }
      );
    }

    if (!data.village || data.village.trim() === "") {
      return NextResponse.json(
        { error: "Village and district are required to evaluate pilot suitability." },
        { status: 400 }
      );
    }

    if (!data.crop || data.crop.trim() === "") {
      return NextResponse.json(
        { error: "Please specify the primary crop(s) you cultivate." },
        { status: 400 }
      );
    }

    // 3. Save Lead
    const saved = saveLead({
      role: data.role || "farmer",
      name: data.name || "Anonymous Grower",
      phone: data.phone.trim(),
      village: data.village.trim(),
      state: data.state || "Not specified",
      crop: data.crop.trim(),
      acres: data.acres || "",
      language: data.language || "en",
      email: data.email || "",
      message: data.message || "",
      source: data.source || "Website Form",
    });

    // 4. Admin Email Notification Hook (Optional Resend / SMTP integration)
    const adminEmail = process.env.AGRIVIGIL_ADMIN_EMAIL || "admin@agrivigil.in";
    if (process.env.RESEND_API_KEY) {
      try {
        // Example: If Resend is configured
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "AgriVigil Notifications <pilot@agrivigil.in>",
            to: adminEmail,
            subject: `New AgriVigil Pilot Lead: ${saved.name} (${saved.crop}, ${saved.village})`,
            text: `New lead received:\nName: ${saved.name}\nPhone: ${saved.phone}\nRole: ${saved.role}\nVillage: ${saved.village}\nCrop: ${saved.crop}\nAcres: ${saved.acres}\nMessage: ${saved.message}`,
          }),
        });
      } catch (err) {
        console.warn("Could not dispatch email via Resend:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        leadId: saved.id,
        message: "Your pilot application has been recorded. Our team will contact you shortly.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error processing lead submission:", err);
    return NextResponse.json({ error: "Failed to process application. Please call or WhatsApp us directly." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedPassword = process.env.AGRIVIGIL_ADMIN_PASSWORD || "agrivigil2026";

  if (authHeader !== `Bearer ${expectedPassword}`) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const leads = getLeads();
  return NextResponse.json({ leads });
}
