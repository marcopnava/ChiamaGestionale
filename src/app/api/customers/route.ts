import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";
import { CustomerCreateSchema } from "./schema";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const statuses = url.searchParams.getAll("status");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(100, Number(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        statuses.length ? { status: { in: statuses as any } } : {},
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({ rows, total, page, limit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireUser();
    if (!["ADMIN", "SALES"].includes(me.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    const data = CustomerCreateSchema.parse(json);

    const created = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? undefined,
        status: data.status,
        joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
      },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        userId: me.id,
        action: "CREATE",
        entity: "Customer",
        entityId: created.id,
        metadata: JSON.stringify({ email: created.email, status: created.status }),
      },
    });

    // Email evento "nuovo lead"
    if (created.status === "lead") {
      const toTeam = process.env.SALES_TEAM_EMAIL || "sales@example.test";
      await sendEmail({
        to: toTeam,
        subject: `Nuovo lead: ${created.name}`,
        text: `Nuovo lead creato (${created.name} - ${created.email}).`,
        html: `<p>Nuovo lead creato:</p><p><b>${created.name}</b> - ${created.email}</p>`,
      });
    }

    return NextResponse.json({ ok: true, customer: created });
  } catch (e: any) {
    const status = e?.status || 400;
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status });
  }
} 