import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/api/_auth-guard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireUser(); // Solo utenti loggati

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { customer: true, product: true },
    });
    if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Mock PDF generation
    const pdfContent = `
      FATTURA
      
      Cliente: ${sale.customer.name}
      Email: ${sale.customer.email}
      
      Prodotto: ${sale.product.name}
      Mesi: ${sale.months}
      Importo: €${sale.amount}
      
      Data: ${new Date().toLocaleDateString('it-IT')}
    `;

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="fattura-${id}.pdf"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Bad Request" }, { status: 400 });
  }
} 