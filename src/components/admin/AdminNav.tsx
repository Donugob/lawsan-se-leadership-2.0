"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
  Menu,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const baseNavigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Delegates", href: "/admin/delegates", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
];

interface AdminNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Signed out safely");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      toast.error("Failed to sign out");
    }
  };

  const navigation = [...baseNavigation];
  if (user?.role === "SUPER_ADMIN") {
    navigation.push({ name: "Team", href: "/admin/team", icon: Shield });
  }
  navigation.push({ name: "Settings", href: "/admin/settings", icon: Settings });

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-forest-950 hidden lg:flex flex-col border-r border-white/5 z-40">
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
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${isActive
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

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-forest-400 hover:text-white hover:bg-forest-900 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-forest-50 px-6 lg:px-10 py-5 lg:ml-72">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-2xl bg-forest-50 flex items-center justify-center lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-forest-900" /> : <Menu className="w-5 h-5 text-forest-900" />}
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400">System Dashboard</p>
              <p className="text-sm font-bold text-forest-900">Leadership 2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-forest-900">{user?.name}</p>
                <p className="text-[10px] text-forest-500 uppercase tracking-tighter font-bold">
                  {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Administrator"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-forest-950 flex items-center justify-center text-gold-500 font-bold border border-white/10 shadow-lg">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[35] lg:hidden">
          <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="absolute top-[81px] left-6 right-6 bg-white rounded-[2rem] p-4 shadow-2xl border border-forest-100 space-y-2 animate-in slide-in-from-top-4 duration-300">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${isActive
                    ? "bg-forest-900 text-white"
                    : "text-forest-600 hover:bg-forest-50"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all border-t border-forest-50 mt-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Bar (Alternative style) */}
      <nav className="fixed bottom-0 inset-x-0 bg-forest-950 border-t border-white/5 p-4 flex items-center justify-around lg:hidden z-50">
        {navigation.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${isActive ? "text-gold-500" : "text-forest-400"}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] uppercase tracking-widest font-bold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
