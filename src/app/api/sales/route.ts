import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { SaleCreateSchema } from "./schema";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const statuses = url.searchParams.getAll("status");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        statuses.length ? { status: { in: statuses as any } } : {},
        q
          ? {
              OR: [
                { customer: { name: { contains: q, mode: "insensitive" } } },
                { product: { name: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: { customer: true, product: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ]);

    return NextResponse.json({ rows, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser();
    if (!["ADMIN", "SALES"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const json = await req.json();
    const body = SaleCreateSchema.parse({
      ...json,
      months: typeof json.months === "string" ? parseInt(json.months, 10) : json.months,
    });

    const product = await prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const amount = product.monthly * body.months;

    const sale = await prisma.sale.create({
      data: {
        customerId: body.customerId,
        productId: body.productId,
        userId: me.id,
        months: body.months,
        amount,
        status: "pending",
        soldAt: body.soldAt ? new Date(body.soldAt) : new Date(),
      },
      include: { customer: true, product: true },
    });

    // Crea Subscription "in attesa" usando past_due come pending
    await prisma.subscription.upsert({
      where: { saleId: sale.id },
      update: {},
      create: {
        saleId: sale.id,
        status: "past_due",
        stripeId: null,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * body.months),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "CREATE",
        entity: "Sale",
        entityId: sale.id,
        metadata: JSON.stringify({ amount: amount.toString(), months: body.months }),
      },
    });

    return NextResponse.json({ ok: true, sale });
  } catch (e: any) {
    const status = e?.status || 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 