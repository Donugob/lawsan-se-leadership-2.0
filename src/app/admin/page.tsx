import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/DashboardClient";

async function getStats() {
  const [total, paid, pending, revenueResult] = await Promise.all([
    prisma.delegate.count(),
    prisma.delegate.count({ where: { status: "paid" } }),
    prisma.delegate.count({ where: { status: "pending" } }),
    prisma.delegate.aggregate({
      _sum: { amount: true },
      where: { status: "paid" }
    })
  ]);

  return { 
    total, 
    paid, 
    pending, 
    revenue: revenueResult._sum.amount || 0 
  };
}

async function getRecentDelegates() {
  return await prisma.delegate.findMany({
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
