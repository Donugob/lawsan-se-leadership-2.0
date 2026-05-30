import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { fulfillRegistration } from "@/lib/payment";
import { logAdminAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminName = session.name || "Admin";
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Paystack secret key is missing" }, { status: 500 });
    }

    // Fetch all pending delegates
    const pendingDelegates = await prisma.delegate.findMany({
      where: { status: "pending" },
    });

    let reconciledCount = 0;
    const batchSize = 10;
    
    // Process in batches
    for (let i = 0; i < pendingDelegates.length; i += batchSize) {
      const batch = pendingDelegates.slice(i, i + batchSize);

      // We use Promise.all to fetch in parallel for the current batch
      await Promise.all(batch.map(async (delegate) => {
        try {
          const res = await fetch(`https://api.paystack.co/transaction?email=${encodeURIComponent(delegate.email)}&status=success`, {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
          });
          
          if (!res.ok) return;

          const json = await res.json();
          if (json.status && json.data && json.data.length > 0) {
            // Find a transaction that matches this delegate's regId and amount
            const EXPECTED_AMOUNT = 315000;
            const validTx = json.data.find((tx: any) => 
              tx.metadata && tx.metadata.reg_id === delegate.regId && tx.amount === EXPECTED_AMOUNT
            );

            if (validTx && delegate.regId) {
              // Log to the Transaction table just like webhook does
              await prisma.transaction.upsert({
                where: { reference: validTx.reference },
                update: {
                  status: 'success',
                  metadata: validTx
                },
                create: {
                  reference: validTx.reference,
                  email: validTx.customer?.email || delegate.email,
                  amount: validTx.amount ? validTx.amount / 100 : 0,
                  status: 'success',
                  channel: validTx.channel,
                  currency: validTx.currency,
                  ipAddress: validTx.ip_address,
                  paidAt: validTx.paid_at ? new Date(validTx.paid_at) : null,
                  metadata: validTx
                }
              });
              
              await fulfillRegistration(delegate.regId, validTx.reference, adminName);
              reconciledCount++;
            }
          }
        } catch (err) {
          console.error(`Error reconciling delegate ${delegate.email}:`, err);
        }
      }));
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < pendingDelegates.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    await logAdminAction("MANUAL_RECONCILIATION", { 
      totalPendingChecked: pendingDelegates.length, 
      reconciledCount 
    }, { adminName });

    return NextResponse.json({ 
      success: true, 
      checked: pendingDelegates.length, 
      reconciled: reconciledCount 
    });

  } catch (error) {
    console.error("Reconciliation error:", error);
    return NextResponse.json({ error: "Failed to run reconciliation" }, { status: 500 });
  }
}
