import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CustomersDataTable } from "@/components/customers/CustomersDataTable";
import { Customer } from "@/components/customers/CustomersDataTable";
import { FlipButton } from "@/components/ui/shadcn-io/flip-button";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  // Primo paint con un po' di dati (evita pagina vuota)
  const initial = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Transform data for the new Data Table
  const customersData: Customer[] = initial.map((customer: any) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone || "",
    company: customer.company || "",
    status: customer.status || "active",
    createdAt: customer.createdAt.toISOString(),
    totalRevenue: customer.totalRevenue || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestione Clienti</h1>
        <FlipButton
          frontText="Nuovo Cliente"
          backText="Nuovo Cliente"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        />
      </div>
      <CustomersDataTable data={customersData} />
    </div>
  );
} 