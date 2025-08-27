import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { ProductUpdateSchema } from "../schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id } });
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
    if (!["ADMIN"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const data = ProductUpdateSchema.parse(json);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        monthly: data.monthly ?? undefined,
        kind: data.kind ?? undefined,
        isActive: data.isActive ?? undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "UPDATE",
        entity: "Product",
        entityId: updated.id,
        metadata: JSON.stringify({ kind: updated.kind, isActive: updated.isActive }),
      },
    });

    return NextResponse.json({ ok: true, product: updated });
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

    const deleted = await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "DELETE",
        entity: "Product",
        entityId: deleted.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === "P2025" ? 404 : 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 