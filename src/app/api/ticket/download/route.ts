import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { DelegateTicket } from "@/components/pdf/DelegateTicket";
import React from "react";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regId = searchParams.get("regId");

    if (!regId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const delegate = await prisma.delegate.findUnique({
      where: { regId }
    });

    if (!delegate || delegate.status !== "paid") {
      return NextResponse.json({ error: "Delegate not found or payment not confirmed" }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(React.createElement(DelegateTicket, { delegate: delegate as any }) as any);

    return new Response(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Ticket-${regId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 });
  }
}
