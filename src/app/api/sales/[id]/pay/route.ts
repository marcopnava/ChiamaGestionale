import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const me = await requireUser();
    if (!["ADMIN", "SALES"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { subscription: true },
    });
    if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Aggiorna vendita e subscription
    const [updatedSale, updatedSubscription] = await Promise.all([
      prisma.sale.update({
        where: { id },
        data: { status: "paid" },
      }),
      prisma.subscription.update({
        where: { id: sale.subscription!.id },
        data: { status: "active" },
      }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "PAY",
        entity: "Sale",
        entityId: updatedSale.id,
        metadata: JSON.stringify({ status: "paid" }),
      },
    });

    return NextResponse.json({ ok: true, sale: updatedSale });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status: 400 });
  }
} 