import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/DashboardClient";

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
  // Note: For simplicity and following user request, we use 1.5% + 100
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
  const stats = await getStats();
  const recentDelegates = await getRecentDelegates();

  return (
    <AdminDashboardClient 
      stats={stats} 
      recentRegistrations={recentDelegates} 
    />
  );
}
