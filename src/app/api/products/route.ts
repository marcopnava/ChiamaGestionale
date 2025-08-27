import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { ProductCreateSchema } from "./schema";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const kinds = url.searchParams.getAll("kinds");
    const activeParam = url.searchParams.get("active");
    const min = url.searchParams.get("min");
    const max = url.searchParams.get("max");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        kinds.length ? { kind: { in: kinds as any } } : {},
        activeParam !== null ? { isActive: activeParam === "true" } : {},
        min ? { monthly: { gte: parseFloat(min) } } : {},
        max ? { monthly: { lte: parseFloat(max) } } : {},
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ rows, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser();
    if (me.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const json = await req.json();
    const data = ProductCreateSchema.parse(json);

    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? undefined,
        monthly: data.monthly,
        kind: data.kind,
        isActive: data.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "CREATE",
        entity: "Product",
        entityId: created.id,
        metadata: JSON.stringify({ monthly: created.monthly.toString(), kind: created.kind }),
      },
    });

    return NextResponse.json({ ok: true, product: created });
  } catch (e: any) {
    const status = e?.status || 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 