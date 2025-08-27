import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { SaleUpdateSchema } from "../schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await prisma.sale.findUnique({
    where: { id },
    include: { customer: true, product: true, subscription: true },
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await requireUser();
    if (!["ADMIN", "SALES"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const data = SaleUpdateSchema.parse(json);

    // Se months cambia, ricalcola amount
    let amount = undefined;
    if (data.months !== undefined) {
      const sale = await prisma.sale.findUnique({
        where: { id },
        include: { product: true },
      });
      if (sale?.product) {
        amount = sale.product.monthly * data.months;
      }
    }

    const updated = await prisma.sale.update({
      where: { id },
      data: {
        months: data.months ?? undefined,
        amount: amount,
        status: data.status ?? undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "UPDATE",
        entity: "Sale",
        entityId: updated.id,
        metadata: JSON.stringify({ status: updated.status, months: updated.months }),
      },
    });

    return NextResponse.json({ ok: true, sale: updated });
  } catch (e: any) {
    const status = e?.code === "P2025" ? 404 : 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await requireUser();
    if (!["ADMIN", "SALES"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await prisma.sale.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "DELETE",
        entity: "Sale",
        entityId: deleted.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === "P2025" ? 404 : 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 