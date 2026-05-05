import { NextResponse } from "next/server";
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
    console.log(`📩 Paystack Webhook Received: ${event.event}`);

    if (event.event === "charge.success") {
      const { reference, customer, amount } = event.data;
      const email = customer.email;

      console.log(`✅ Payment SUCCESS for ${email}. Reference: ${reference}. Amount: ${amount / 100} NGN`);

      await prisma.delegate.update({
        where: { email },
        data: {
          status: "paid",
          paystackRef: reference
        }
      });
      
      console.log(`💾 Database UPDATED: ${email} marked as PAID.`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
