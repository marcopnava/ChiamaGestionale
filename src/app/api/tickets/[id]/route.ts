import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { TicketUpdateSchema } from "../schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await prisma.ticket.findUnique({
    where: { id },
    include: { customer: true, assignee: true },
  });
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
    if (!["ADMIN", "SUPPORT"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const data = TicketUpdateSchema.parse(json);

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        status: data.status ?? undefined,
        assigneeId: data.assigneeId ?? undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "UPDATE",
        entity: "Ticket",
        entityId: updated.id,
        metadata: JSON.stringify({ status: updated.status, assigneeId: updated.assigneeId }),
      },
    });

    // Email opzionale su chiusura
    if (data.status === "closed") {
      // TODO: invia email a SUPPORT_TEAM_EMAIL
      console.log("Ticket chiuso:", updated.id);
    }

    return NextResponse.json({ ok: true, ticket: updated });
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

    const deleted = await prisma.ticket.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "DELETE",
        entity: "Ticket",
        entityId: deleted.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.code === "P2025" ? 404 : 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 