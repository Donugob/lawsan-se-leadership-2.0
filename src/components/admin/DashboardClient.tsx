"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, ArrowUpRight, GraduationCap, Briefcase, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  stats: {
    total: number;
    paid: number;
    pending: number;
    revenue: number;
  };
  recentRegistrations: any[];
}

export default function AdminDashboardClient({ stats, recentRegistrations }: DashboardClientProps) {
  const cards = [
    { label: "Total Delegates", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50", change: "+5% vs last week" },
    { label: "Verified Payments", value: stats.paid, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", change: "+12%" },
    { label: "Pending Verification", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", change: "-2%" },
    { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "text-gold-600", bg: "bg-gold-50", change: "+18%" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-forest-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-forest-900/20 border border-forest-800"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-heading font-bold mb-4">Good Day, Administrator.</h2>
          <p className="text-forest-200 text-lg font-light leading-relaxed">
            The conference portal is currently handling traffic smoothly. You have <span className="text-gold-400 font-bold">{stats.total}</span> total registrations across all categories.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-forest-100 shadow-sm relative overflow-hidden group hover:border-gold-300 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-forest-400">
                  Real-time
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-forest-500 font-bold text-xs uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-heading font-bold text-forest-950 mb-2">{stat.value}</h3>
                <p className="text-[10px] text-forest-400 font-medium">{stat.change}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Registrations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-forest-100 rounded-[2.5rem] shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-forest-50 flex justify-between items-center bg-forest-50/30">
          <div>
            <h3 className="text-2xl font-heading font-bold text-forest-950">Recent Delegates</h3>
            <p className="text-forest-500 text-sm">The latest five entries into the system.</p>
          </div>
          <Link href="/admin/delegates" className="flex items-center gap-2 text-forest-900 font-bold hover:text-gold-600 transition-colors bg-white px-6 py-3 rounded-xl border border-forest-200 shadow-sm text-sm">
            Manage All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-forest-100 text-forest-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="p-8">Delegate</th>
                <th className="p-8">Category</th>
                <th className="p-8">Status</th>
                <th className="p-8">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-forest-400">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((reg, idx) => (
                  <tr key={reg.id} className="hover:bg-forest-50/50 transition-colors group">
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="font-bold text-forest-900 text-lg">{reg.firstName} {reg.lastName}</span>
                        <span className="text-xs text-forest-500">{reg.email}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-forest-50 text-forest-800 border border-forest-100">
                        {reg.isStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                        {reg.isStudent ? "Student" : "Professional"}
                      </span>
                    </td>
                    <td className="p-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        reg.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${reg.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-8 text-sm text-forest-500 font-medium">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
