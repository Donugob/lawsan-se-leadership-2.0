import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { sendTicketEmail } from "@/lib/resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { DelegateTicket } from "@/components/pdf/DelegateTicket";
import React from "react";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "anonymous";
    
    // Strict limit for resending: 2 per hour per IP/Email
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (isRateLimited(`resend_${ip}_${email}`, 2, 60 * 60 * 1000)) {
      return NextResponse.json({ 
        error: "Too many resend attempts. Please check your spam folder or wait an hour." 
      }, { status: 429 });
    }

    const delegate = await prisma.delegate.findUnique({
      where: { email }
    });

    if (!delegate || delegate.status !== "paid") {
      // Security: Don't confirm if email exists or not, just say "If registered..."
      return NextResponse.json({ 
        success: true, 
        message: "If a confirmed registration exists for this email, the ticket has been resent." 
      });
    }

    // Generate and Resend
    try {
      const pdfBuffer = await renderToBuffer(React.createElement(DelegateTicket, { delegate: delegate as any }) as any);
      
      await sendTicketEmail({
        email: delegate.email,
        firstName: delegate.firstName,
        regId: delegate.regId || "N/A",
        pdfBuffer
      });

      return NextResponse.json({ 
        success: true, 
        message: "Ticket resent successfully. Please check your Spam or Junk folder if you don't see it." 
      });
    } catch (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json({ error: "Failed to resend ticket" }, { status: 500 });
    }
  } catch (error) {
    console.error("Resend API error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
