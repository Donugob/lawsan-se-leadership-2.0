"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Award, 
  Calendar, 
  Settings, 
  ChevronRight,
  LogOut,
  Bell
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Delegates", href: "/admin/delegates", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Awards", href: "/admin/awards", icon: Award },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFDFB]">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-forest-950 hidden lg:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-white tracking-tighter">LAWSAN SE</span>
            <span className="text-[10px] text-gold-500 uppercase tracking-[0.4em] font-bold">Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                  isActive 
                    ? "bg-gold-500 text-forest-950 shadow-lg shadow-gold-500/10" 
                    : "text-forest-300 hover:text-white hover:bg-forest-900"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-forest-950" : "text-forest-500 group-hover:text-forest-300"}`} />
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-forest-900">
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-forest-400 hover:text-white hover:bg-forest-900 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pb-24 lg:pb-12">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-forest-50 px-6 lg:px-10 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center lg:hidden">
                <LayoutDashboard className="w-5 h-5 text-forest-900" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400">System Dashboard</p>
                <p className="text-sm font-bold text-forest-900">May 2026 Conference</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-600 hover:bg-forest-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
              <div className="h-10 w-[1px] bg-forest-100 mx-2 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-forest-900">Admin User</p>
                  <p className="text-[10px] text-forest-500">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-forest-950 flex items-center justify-center text-gold-500 font-bold">
                  AU
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-forest-950 border-t border-forest-900 p-4 flex items-center justify-around lg:hidden z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? "text-gold-500" : "text-forest-400"}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
