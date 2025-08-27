import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json(); // mock: nessuna verifica firma
    const type = payload?.type as string | undefined;

    if (type === "invoice.paid") {
      const saleId: string | undefined = payload?.data?.saleId;
      if (!saleId) return NextResponse.json({ error: "saleId missing" }, { status: 400 });

      const sale = await prisma.sale.update({
        where: { id: saleId },
        data: { status: "paid" },
      });

      await prisma.subscription.upsert({
        where: { saleId: sale.id },
        update: { status: "active", stripeId: payload?.data?.stripeId ?? `sub_mock_${sale.id}` },
        create: {
          saleId: sale.id,
          status: "active",
          stripeId: payload?.data?.stripeId ?? `sub_mock_${sale.id}`,
          currentPeriodEnd: new Date(Date.now() + 1000*60*60*24*30*sale.months),
        },
      });

      await prisma.auditLog.create({
        data: { 
          action: "UPDATE", 
          entity: "Sale", 
          entityId: sale.id, 
          metadata: JSON.stringify({ via: "webhook", event: type }) 
        },
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Bad Request" }, { status: 400 });
  }
} 