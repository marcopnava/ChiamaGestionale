import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";

export async function GET(req: Request) {
  try {
    const me = await requireUser();
    if (me.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const entity = url.searchParams.get("entity") || "";
    const action = url.searchParams.get("action") || "";
    const userId = url.searchParams.get("userId") || "";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

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
          ? {
              createdAt: {
                gte: from ? new Date(from) : undefined,
                lte: to ? new Date(to) : undefined,
              },
            }
          : {},
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({ rows, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
} 