export const dynamic = 'force-dynamic';

import AdminDashboardClient from "@/components/admin/DashboardClient";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getStats() {
  const paidDelegates = await prisma.delegate.findMany({
    where: { status: "paid" },
    select: { amount: true }
  });

  const pending = await prisma.delegate.count({
    where: { status: "pending" }
  });

  const grossRevenue = paidDelegates.reduce((sum, d) => sum + d.amount, 0);
  
  // Paystack fee: 1.5% + 100 (capped at 2000)
  const netRevenue = paidDelegates.reduce((sum, d) => {
    const fee = (d.amount * 0.015) + 100;
    const cappedFee = Math.min(fee, 2000);
    return sum + (d.amount - cappedFee);
  }, 0);

  return { 
    total: paidDelegates.length, // Only paid delegates are counted as 'delegates'
    paid: paidDelegates.length, 
    pending, 
    revenue: grossRevenue,
    netRevenue: Math.round(netRevenue)
  };
}

async function getRecentDelegates() {
  return await prisma.delegate.findMany({
    where: { status: "paid" },
    take: 5,
    orderBy: { createdAt: "desc" }
  });
}

export default async function AdminOverview() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const stats = await getStats();
  const recentDelegates = await getRecentDelegates();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-forest-950 mb-2">Executive Overview</h1>
        <p className="text-forest-500 text-sm">Real-time performance metrics and delegate analytics.</p>
      </div>

      <AdminDashboardClient 
        stats={stats} 
        recentRegistrations={recentDelegates} 
      />
    </div>
  );
}
