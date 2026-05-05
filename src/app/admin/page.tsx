import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/DashboardClient";

async function getStats() {
  const [total, paid, pending] = await Promise.all([
    prisma.delegate.count(),
    prisma.delegate.count({ where: { status: "paid" } }),
    prisma.delegate.count({ where: { status: "pending" } }),
  ]);

  return { 
    total, 
    paid, 
    pending, 
    revenue: paid * 5000 
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
