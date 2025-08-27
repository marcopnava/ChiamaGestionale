import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { CustomerUpdateSchema } from "../schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await prisma.customer.findUnique({ where: { id } });
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
    if (!["ADMIN", "SALES", "SUPPORT"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const data = CustomerUpdateSchema.parse(json);

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        status: data.status ?? undefined,
        joinedAt: data.joinedAt ? new Date(data.joinedAt) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "UPDATE",
        entity: "Customer",
        entityId: updated.id,
        metadata: JSON.stringify({ status: updated.status }),
      },
    });

    // (Facolt.) se status passa a churn → potresti inviare una mail qui

    return NextResponse.json({ ok: true, customer: updated });
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
    if (!["ADMIN"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await prisma.customer.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "DELETE",
        entity: "Customer",
        entityId: deleted.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === "P2025" ? 404 : 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 