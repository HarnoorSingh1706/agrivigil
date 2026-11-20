import { NextRequest, NextResponse } from "next/server";
import { getLeads } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("key");
  const expectedPassword = process.env.AGRIVIGIL_ADMIN_PASSWORD || "agrivigil2026";

  if (password !== expectedPassword) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const leads = getLeads();

  // Generate CSV rows
  const headers = ["ID", "Date", "Role", "Name", "Phone", "Village", "State", "Crop", "Acres", "Language", "Email", "Message", "Source"];
  
  const escapeCsv = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = leads.map((lead) => [
    escapeCsv(lead.id),
    escapeCsv(lead.createdAt),
    escapeCsv(lead.role),
    escapeCsv(lead.name),
    escapeCsv(lead.phone),
    escapeCsv(lead.village),
    escapeCsv(lead.state),
    escapeCsv(lead.crop),
    escapeCsv(lead.acres),
    escapeCsv(lead.language),
    escapeCsv(lead.email),
    escapeCsv(lead.message),
    escapeCsv(lead.source),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agrivigil-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
