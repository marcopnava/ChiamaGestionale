import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { churnScore } from "@/lib/churn";

function daysBetween(a: Date, b: Date) {
  return Math.max(0, Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function GET() {
  try {
    const [customers, ticketsOpen, subs] = await Promise.all([
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.ticket.groupBy({
        by: ["customerId"],
        where: { status: "open" },
        _count: { _all: true },
      }),
      prisma.subscription.findMany({
        where: { status: "active" },
        select: {
          sale: { select: { customerId: true, product: { select: { monthly: true } }, months: true } },
        },
      }),
    ]);

    const openMap = new Map<string, number>();
    ticketsOpen.forEach(t => openMap.set(t.customerId, t._count._all));

    const mrrMap = new Map<string, number>();
    const monthsMap = new Map<string, number[]>();
    subs.forEach(s => {
      const cid = s.sale.customerId;
      mrrMap.set(cid, (mrrMap.get(cid) ?? 0) + Number(s.sale.product.monthly));
      monthsMap.set(cid, [...(monthsMap.get(cid) ?? []), s.sale.months]);
    });

    const now = new Date();
    const scored = customers.map(c => {
      const daysInactive = c.joinedAt ? Math.max(0, 120 - Math.min(120, daysBetween(now, c.joinedAt))) : 90;
      const monthsArr = monthsMap.get(c.id) ?? [];
      const months = monthsArr.length ? Math.round(monthsArr.reduce((a,b)=>a+b,0) / monthsArr.length) : 6;
      const mrr = mrrMap.get(c.id) ?? 0;
      const tickets = openMap.get(c.id) ?? 0;
      const score = churnScore({ daysInactive, months, mrr, ticketsOpen: tickets });
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        status: c.status,
        score,
        mrr,
        ticketsOpen: tickets,
      };
    });

    const top = scored.sort((a,b)=>b.score - a.score).slice(0, 10);
    return NextResponse.json({ rows: top });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
} 