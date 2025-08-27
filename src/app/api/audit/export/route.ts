import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { toCSV, toXLSX, toPDF } from "@/lib/export";

export async function GET(req: Request) {
  const me = await requireUser();
  if (me.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  const entity = url.searchParams.get("entity") || "";
  const action = url.searchParams.get("action") || "";
  const userId = url.searchParams.get("userId") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const format = (url.searchParams.get("format") || "csv") as "csv" | "xlsx" | "pdf";

  const where: any = {
    AND: [
      q
        ? {
            OR: [
              { entity: { contains: q, mode: "insensitive" } },
              { entityId: { contains: q, mode: "insensitive" } },
              { metadata: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      entity ? { entity } : {},
      action ? { action } : {},
      userId ? { userId } : {},
      from || to
        ? { createdAt: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } }
        : {},
    ],
  };

  const rows = await prisma.auditLog.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const flat = rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    user: r.user?.name || r.user?.email || r.userId,
    action: r.action,
    entity: r.entity,
    entityId: r.entityId,
    metadata: r.metadata ? JSON.stringify(r.metadata) : "",
  }));

  const filename = `audit.${format}`;
  if (format === "csv") {
    const buf = toCSV(flat);
    return new NextResponse(buf, { headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    }});
  }
  if (format === "xlsx") {
    const buf = toXLSX(flat, "AUDIT");
    return new NextResponse(buf, { headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    }});
  }
  const pdf = await toPDF(flat, "AUDIT LOG");
  return new NextResponse(pdf, { headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
  }});
} 