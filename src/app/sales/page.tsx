import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SalesTable from "@/components/sales/SalesTable";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const [initial, customers, products] = await Promise.all([
    prisma.sale.findMany({
      include: { customer: true, product: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, monthly: true } }),
  ]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Vendite</h1>
      <SalesTable
        initial={initial as any}
        customers={customers}
        products={products as any}
        role={user.role as any}
      />
    </div>
  );
} 