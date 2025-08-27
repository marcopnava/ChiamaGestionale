import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const me = await currentUser();
  if (!me) redirect("/login");
  if (me.role !== "ADMIN") redirect("/"); // RBAC: solo ADMIN

  const [initial, users, entitiesRaw] = await Promise.all([
    prisma.auditLog.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
    prisma.auditLog.findMany({ select: { entity: true }, distinct: ["entity"] }),
  ]);

  const rows = initial.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }));
  const entities = entitiesRaw.map(e => e.entity).filter(Boolean) as string[];

  // lazy client import per evitare idratazione pesante
  const AuditTable = require("@/components/audit/AuditTable").default;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Audit Log</h1>
      <AuditTable initial={rows as any} users={users as any} entities={entities} />
    </div>
  );
} 