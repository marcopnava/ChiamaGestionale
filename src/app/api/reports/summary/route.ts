import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [aggPaid, activeSubs, activeCount, churnCount] = await Promise.all([
      prisma.sale.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
      prisma.subscription.findMany({
        where: { status: "active" },
        select: { sale: { select: { product: { select: { monthly: true } } } } },
      }),
      prisma.customer.count({ where: { status: "active" } }),
      prisma.customer.count({ where: { status: "churn" } }),
    ]);

    const paidRevenue = Number(aggPaid._sum.amount ?? 0);
    const mrr = activeSubs.reduce((s, x) => s + Number(x.sale.product.monthly), 0);
    const base = activeCount + churnCount || 1;
    const churnRate = (churnCount / base) * 100;

    const arpu = activeCount > 0 ? paidRevenue / activeCount : 0;
    const goal = Number(process.env.REPORTS_MRR_GOAL ?? 5000);
    const mrrPct = Math.min(100, (mrr / (goal || 1)) * 100);

    // Serie Radar 0..100 (semplici normalizzazioni)
    const radar = [
      { kpi: "MRR", value: Math.round(mrrPct) },
      { kpi: "Churn", value: Math.round(Math.min(100, churnRate)) },
      { kpi: "ARPU", value: Math.round(Math.min(100, (arpu / 200) * 100)) },
      { kpi: "NPS", value: 70 }, // placeholder (non tracciato nel DB)
    ];

    return NextResponse.json({
      paidRevenue,
      mrr,
      arpu,
      churnRate,
      radar,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
} 