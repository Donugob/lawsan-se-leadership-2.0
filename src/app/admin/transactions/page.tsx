export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { CreditCard, Download, Search, Filter } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getTransactions(search?: string) {
  return await prisma.delegate.findMany({
    orderBy: { updatedAt: "desc" },
    where: {
      status: { in: ["paid", "pending"] },
      ...(search ? {
        OR: [
          { paystackRef: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      } : {})
    }
  });
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const transactions = await getTransactions(query);
  const totalRevenue = transactions
    .filter(t => t.status === "paid")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-950">Financial Overview</h1>
          <p className="text-forest-500 text-sm">Monitor all {transactions.length} incoming payments and transaction references.</p>
        </div>
        <div className="bg-forest-900 text-gold-400 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-forest-900/10">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Total Revenue</p>
            <p className="text-xl font-heading font-bold">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <CreditCard className="w-8 h-8 opacity-40" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-forest-100 shadow-sm flex flex-col md:flex-row gap-4">
        <form className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input 
            name="q"
            defaultValue={query}
            placeholder="Search by reference or email..." 
            className="w-full pl-10 pr-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
          />
        </form>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-forest-200 px-4 py-2.5 rounded-xl text-forest-700 font-medium hover:bg-forest-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-white border border-forest-200 px-4 py-2.5 rounded-xl text-forest-700 font-medium hover:bg-forest-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-forest-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest-50/50 border-b border-forest-100 text-forest-500 text-xs uppercase tracking-wider">
                <th className="p-6 font-semibold">Reference</th>
                <th className="p-6 font-semibold">Delegate</th>
                <th className="p-6 font-semibold">Amount</th>
                <th className="p-6 font-semibold">Status</th>
                <th className="p-6 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-forest-400">
                    No transactions found in the system.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-forest-50/30 transition-colors group">
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100 group-hover:border-gold-300 group-hover:bg-white transition-all">
                        {t.paystackRef || "N/A"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-forest-900">{t.firstName} {t.lastName}</span>
                        <span className="text-xs text-forest-500">{t.email}</span>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-forest-900">
                      ₦{t.amount.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        t.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${t.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-forest-500 font-medium">
                      {new Date(t.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
