import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReportsContent from "@/components/reports/ReportsContent";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const [customers, products, sales] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id:true, name:true, email:true, status:true, joinedAt:true },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id:true, name:true, kind:true, monthly:true, isActive:true },
    }),
    prisma.sale.findMany({
      include: { customer: { select: { name:true } }, product: { select: { name:true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // serializza date/decimal
  const c = customers.map(x=>({ ...x, joinedAt: x.joinedAt ? x.joinedAt.toISOString() : null }));
  const p = products.map(x=>({ ...x, monthly: String(x.monthly) }));
  const s = sales.map(x=>({
    id: x.id, customer: x.customer, product: x.product, months: x.months,
    amount: String(x.amount), status: x.status, soldAt: x.soldAt.toISOString()
  }));

  return <ReportsContent customers={c} products={p} sales={s} />;
} 