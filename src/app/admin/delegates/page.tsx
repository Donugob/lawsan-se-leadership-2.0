export const dynamic = 'force-dynamic';

import { Search, Filter, Download, UserPlus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Delegate } from "@prisma/client";

// Explicitly type the return as Promise<Delegate[]>
async function getDelegates(search?: string, status?: string, type?: string): Promise<Delegate[]> {
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

    if (status === 'pending') {
      where.status = 'pending';
    } else if (status === 'all') {
      // Show all
    } else {
      where.status = 'paid';
    }

    if (type === 'student') {
      where.isStudent = true;
    } else if (type === 'professional') {
      where.isStudent = false;
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
  const type = typeof params.type === 'string' ? params.type : 'all';
  const delegates = await getDelegates(query, status, type);

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
        <form className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search delegates..." 
              className="w-full pl-10 pr-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
            />
          </div>

          <div className="flex gap-2 bg-forest-50 p-1.5 rounded-2xl border border-forest-100">
            {[
              { id: 'paid', label: 'Verified' },
              { id: 'pending', label: 'Pending' },
              { id: 'all', label: 'All' },
            ].map((t) => {
              const isActive = status === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/admin/delegates?status=${t.id}${query ? `&q=${query}` : ''}${type !== 'all' ? `&type=${type}` : ''}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

          <div className="w-full md:w-48">
            <select 
              name="type"
              defaultValue={type}
              onChange={(e) => {
                const val = e.target.value;
                window.location.href = `/admin/delegates?status=${status}${query ? `&q=${query}` : ''}${val !== 'all' ? `&type=${val}` : ''}`;
              }}
              className="w-full px-4 py-2.5 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-sm font-medium"
            >
              <option value="all">All Categories</option>
              <option value="student">Students Only</option>
              <option value="professional">Professionals Only</option>
            </select>
          </div>

          <button type="submit" className="w-full md:w-auto bg-forest-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-forest-800 transition-all active:scale-95 whitespace-nowrap">
            Apply
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-forest-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest-50/50 border-b border-forest-100 text-forest-500 text-xs uppercase tracking-wider">
                <th className="p-6 font-semibold">Delegate</th>
                <th className="p-6 font-semibold">Category</th>
                <th className="p-6 font-semibold">Affiliation</th>
                <th className="p-6 font-semibold">Reg ID</th>
                <th className="p-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {delegates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-forest-400">
                    No delegates found matching the criteria.
                  </td>
                </tr>
              ) : (
                delegates.map((delegate) => (
                  <tr key={delegate.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-forest-900">{delegate.firstName} {delegate.lastName}</span>
                        <span className="text-xs text-forest-500">{delegate.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        delegate.isStudent ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}>
                        {delegate.isStudent ? 'Student' : 'Professional'}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm text-forest-600 font-medium">
                        {delegate.isStudent ? delegate.university : delegate.profession}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100">
                        #{delegate.regId}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-forest-400 hover:text-forest-900 transition-colors p-2 rounded-lg hover:bg-forest-50">
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
