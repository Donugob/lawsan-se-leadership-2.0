import { NextResponse } from "next/server";
import React from "react";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { fulfillRegistration } from "@/lib/payment";

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

    // Timing-safe comparison to prevent timing attacks
    const hashBuffer = Buffer.from(hash, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (hashBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(hashBuffer, signatureBuffer)) {
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
      const { reference, metadata } = data;
      const regId = metadata?.reg_id;

      if (!regId) {
        console.error("❌ Paystack Webhook Error: reg_id missing in metadata.");
        return NextResponse.json({ error: "reg_id missing" }, { status: 400 });
      }

      const EXPECTED_AMOUNT_KOBO = 315000; // ₦3,150
      if (data.amount !== EXPECTED_AMOUNT_KOBO) {
        console.error(`⚠️ FRAUD ATTEMPT: Received ₦${data.amount/100} for regId ${regId}. Expected ₦3,150.`);
        await logAdminAction("FRAUD_ATTEMPT", { 
          regId, 
          reference, 
          receivedAmount: data.amount/100, 
          expectedAmount: 3150 
        }, { adminName: "SYSTEM_SECURITY" });
        
        return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
      }

      await fulfillRegistration(regId, reference, "SYSTEM_PAYSTACK");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
