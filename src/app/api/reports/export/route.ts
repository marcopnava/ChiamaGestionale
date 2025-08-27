import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCSV, toXLSX, toPDF } from "@/lib/export";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const scope = (url.searchParams.get("scope") || "sales") as "customers" | "products" | "sales";
    const format = (url.searchParams.get("format") || "csv") as "csv" | "xlsx" | "pdf";

    let rows: any[] = [];
    if (scope === "customers") {
      const data = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
      rows = data.map(c => ({
        id: c.id, name: c.name, email: c.email, phone: c.phone ?? "", status: c.status,
        joinedAt: c.joinedAt?.toISOString() ?? "", createdAt: c.createdAt.toISOString()
      }));
    } else if (scope === "products") {
      const data = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
      rows = data.map(p => ({
        id: p.id, name: p.name, kind: p.kind, monthly: Number(p.monthly).toFixed(2),
        isActive: p.isActive, createdAt: p.createdAt.toISOString()
      }));
    } else {
      const data = await prisma.sale.findMany({
        include: { customer: true, product: true },
        orderBy: { createdAt: "desc" }
      });
      rows = data.map(s => ({
        id: s.id,
        customer: s.customer.name,
        product: s.product.name,
        months: s.months,
        amount: Number(s.amount).toFixed(2),
        status: s.status,
        soldAt: s.soldAt.toISOString()
      }));
    }

    const filename = `${scope}_report.${format}`;
    if (format === "csv") {
      const buf = toCSV(rows);
      return new NextResponse(buf, { headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`
      }});
    }
    if (format === "xlsx") {
      const buf = toXLSX(rows, `${scope}`.toUpperCase());
      return new NextResponse(buf, { headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`
      }});
    }
    const pdf = await toPDF(rows, `${scope.toUpperCase()} REPORT`);
    return new NextResponse(pdf, { headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`
    }});
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
} 