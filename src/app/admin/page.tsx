export const dynamic = 'force-dynamic';

import DashboardClient from "@/components/admin/DashboardClient";
import prisma from "@/lib/prisma";

async function getStats() {
  const delegates = await prisma.delegate.findMany({
    where: { status: 'paid' }
  });
  
  const totalRevenue = delegates.reduce((acc, d) => acc + d.amount, 0);
  const students = delegates.filter(d => d.isStudent).length;
  const professionals = delegates.length - students;

  return {
    totalDelegates: delegates.length,
    totalRevenue,
    students,
    professionals
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-forest-950 mb-2">Executive Overview</h1>
        <p className="text-forest-500 text-sm">Real-time performance metrics and delegate analytics.</p>
      </div>

      <DashboardClient stats={stats} />
    </div>
  );
}
