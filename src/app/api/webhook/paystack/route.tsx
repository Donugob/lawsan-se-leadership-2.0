import { NextResponse } from "next/server";
import React from "react";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("❌ Paystack Webhook Error: Invalid signature received.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const data = event.data;
    
    // 1. Audit Trail: Log every event into Transaction table
    if (data?.reference) {
      await prisma.transaction.upsert({
        where: { reference: data.reference },
        update: {
          status: event.event === 'charge.success' ? 'success' : (data.status || 'event_received'),
          metadata: data
        },
        create: {
          reference: data.reference,
          email: data.customer?.email || "unknown",
          amount: data.amount ? data.amount / 100 : 0,
          status: event.event === 'charge.success' ? 'success' : (data.status || 'event_received'),
          channel: data.channel,
          currency: data.currency,
          ipAddress: data.ip_address,
          paidAt: data.paid_at ? new Date(data.paid_at) : null,
          metadata: data
        }
      });
      console.log(`📝 Transaction Logged: ${data.reference} [${event.event}]`);
    }

    // 2. Business Logic: Update Delegate status
    if (event.event === "charge.success") {
      const { reference, customer } = data;
      const email = customer.email;

      const delegate = await prisma.delegate.update({
        where: { email },
        data: {
          status: "paid",
          paystackRef: reference
        }
      });
      
      console.log(`✅ Delegate Verified: ${email} marked as PAID.`);

      // 3. Email & PDF: Generate and send ticket
      try {
        const { renderToBuffer } = await import('@react-pdf/renderer');
        const { DelegateTicket } = await import('@/components/pdf/DelegateTicket');
        const { sendTicketEmail } = await import('@/lib/resend');

        const pdfBuffer = await renderToBuffer(<DelegateTicket delegate={delegate as any} />);
        
        await sendTicketEmail({
          email: delegate.email,
          firstName: delegate.firstName,
          regId: delegate.regId || "N/A",
          pdfBuffer
        });
        
        console.log(`📧 Ticket Email sent to: ${delegate.email}`);
      } catch (emailError) {
        console.error("❌ Failed to send ticket email:", emailError);
        // We don't return error to Paystack so they don't retry unnecessarily 
        // if the database part was successful
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
