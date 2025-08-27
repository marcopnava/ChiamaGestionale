import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { TicketCreateSchema } from "./schema";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const statuses = url.searchParams.getAll("status");
    const assigneeId = url.searchParams.get("assigneeId");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        q
          ? { OR: [
              { title: { contains: q, mode: "insensitive" } },
              { customer: { name: { contains: q, mode: "insensitive" } } },
            ] }
          : {},
        statuses.length ? { status: { in: statuses as any } } : {},
        assigneeId ? { assigneeId } : {},
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: { customer: true, assignee: { select: { id: true, name: true, email: true } } },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({ rows, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser();
    if (!["ADMIN","SUPPORT"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const json = await req.json();
    const body = TicketCreateSchema.parse(json);

    const created = await prisma.ticket.create({
      data: {
        customerId: body.customerId,
        title: body.title,
        description: body.description ?? null,
        assigneeId: body.assigneeId ?? null,
        status: "open",
      },
      include: { customer: true, assignee: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "CREATE",
        entity: "Ticket",
        entityId: created.id,
        metadata: JSON.stringify({ assigneeId: created.assigneeId, status: created.status }),
      },
    });

    // Email opzionale: nuovo ticket
    const to = process.env.SUPPORT_TEAM_EMAIL || "support@example.test";
    await sendEmail({
      to,
      subject: `Nuovo ticket: ${created.title}`,
      text: `Cliente: ${created.customer.name}\nTicket: ${created.title}\nAssegnato a: ${created.assignee?.email ?? "—"}`,
    });

    return NextResponse.json({ ok: true, ticket: created });
  } catch (e: any) {
    const status = e?.status || 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 