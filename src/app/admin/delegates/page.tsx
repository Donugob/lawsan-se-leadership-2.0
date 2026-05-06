import { Search, Filter, Download, UserPlus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Delegate } from "@prisma/client";

// Explicitly type the return as Promise<Delegate[]>
async function getDelegates(search?: string, status?: string): Promise<Delegate[]> {
  try {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { regId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Default to 'paid' if status is not explicitly set to 'all' or 'pending'
    if (status === 'pending') {
      where.status = 'pending';
    } else if (status === 'all') {
      // Show all
    } else {
      where.status = 'paid';
    }

    const delegates = await prisma.delegate.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    return delegates;
  } catch (e) {
    return [];
  }
}

export default async function DelegatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : undefined;
  const status = typeof params.status === 'string' ? params.status : 'paid';
  const delegates = await getDelegates(query, status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest-950">
            {status === 'pending' ? 'Pending Registrations' : 'Conference Delegates'}
          </h1>
          <p className="text-forest-500 text-sm">
            {status === 'pending' 
              ? `There are ${delegates.length} registrations awaiting payment confirmation.`
              : `Manage and track all ${delegates.length} verified participants.`}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-forest-200 px-4 py-2.5 rounded-xl text-forest-700 font-medium hover:bg-forest-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-forest-100 shadow-sm">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search by name, email or Reg ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex bg-forest-50 p-1.5 rounded-2xl border border-forest-100">
            {[
              { id: 'paid', label: 'Verified', count: delegates.filter(d => d.status === 'paid').length },
              { id: 'pending', label: 'Pending', count: delegates.filter(d => d.status === 'pending').length },
              { id: 'all', label: 'All', count: delegates.length },
            ].map((t) => {
              const isActive = status === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/admin/delegates?status=${t.id}${query ? `&q=${query}` : ''}`}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-forest-900 shadow-sm border border-forest-100' 
                      : 'text-forest-400 hover:text-forest-600'
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
          <div className="flex-1" />
          <button type="submit" className="bg-forest-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-800 transition-all shadow-lg shadow-forest-900/10 active:scale-95">
            Refresh List
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-forest-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest-50/50 border-b border-forest-100 text-forest-500 text-xs uppercase tracking-wider">
                <th className="p-6 font-semibold">Reg ID</th>
                <th className="p-6 font-semibold">Name & Contact</th>
                <th className="p-6 font-semibold">Affiliation</th>
                <th className="p-6 font-semibold">Zone Status</th>
                <th className="p-6 font-semibold">Payment</th>
                <th className="p-6 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {delegates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-forest-400">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="w-12 h-12 opacity-20" />
                      <p>No delegates found in the system yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                delegates.map((delegate) => (
                  <tr key={delegate.id} className="hover:bg-forest-50/30 transition-colors group">
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100 group-hover:border-gold-300 transition-all">
                        {delegate.regId || "N/A"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-forest-900">{delegate.firstName} {delegate.lastName}</span>
                        <span className="text-xs text-forest-500">{delegate.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-forest-800">{delegate.university || delegate.organization}</span>
                        <span className="text-xs text-forest-500">{delegate.level || delegate.profession}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        delegate.isSouthEast ? 'bg-gold-50 text-gold-700 border border-gold-200' : 'bg-forest-50 text-forest-600 border border-forest-100'
                      }`}>
                        {delegate.isSouthEast ? 'South East' : 'Out of Zone'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        delegate.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${delegate.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {delegate.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-forest-400 hover:text-forest-900 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
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
