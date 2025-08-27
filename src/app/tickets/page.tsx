import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TicketsTable from "@/components/tickets/TicketsTable";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const [initial, customers, assignees] = await Promise.all([
    prisma.ticket.findMany({
      include: { customer: true, assignee: { select: { id:true, name:true, email:true } } },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: "SUPPORT" }, orderBy: { name: "asc" }, select: { id:true, name:true, email:true } }),
  ]);

  const rows = initial.map(t => ({
    ...t,
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Ticket</h1>
      <TicketsTable
        initial={rows as any}
        customers={customers}
        assignees={assignees as any}
        role={user.role as any}
      />
    </div>
  );
} 