import React from "react";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";

export async function fulfillRegistration(regId: string, reference: string, adminName: string = "SYSTEM_PAYSTACK") {
  // 1. Update Delegate status
  const delegate = await prisma.delegate.update({
    where: { regId },
    data: {
      status: "paid",
      paystackRef: reference
    }
  });
  
  console.log(`✅ Delegate Verified: ${regId} marked as PAID.`);

  // 2. Audit Trail
  await logAdminAction("PAYMENT_VERIFIED", { regId, reference, email: delegate.email }, { adminName });

  // 3. Email & PDF: Generate and send ticket
  try {
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { DelegateTicket } = await import('@/components/pdf/DelegateTicket');
    const { sendTicketEmail } = await import('@/lib/resend');

    const pdfBuffer = await renderToBuffer(<DelegateTicket delegate={delegate as any} /> as any);
    
    await sendTicketEmail({
      email: delegate.email,
      firstName: delegate.firstName,
      regId: delegate.regId || "N/A",
      pdfBuffer
    });
    
    console.log(`📧 Ticket Email sent to: ${delegate.email}`);
  } catch (emailError) {
    console.error("❌ Failed to send ticket email:", emailError);
    // We don't throw an error here because the database part was successful
  }

  return delegate;
}
