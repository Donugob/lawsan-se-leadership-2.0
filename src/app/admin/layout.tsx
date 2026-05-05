"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Bell } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Delegates", href: "/admin/delegates", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-forest-950 border-r border-forest-900 text-forest-200 shadow-2xl relative z-20">
        <div className="p-8 flex items-center gap-3 border-b border-forest-900">
          <div className="w-10 h-10 bg-forest-800 rounded flex items-center justify-center">
            <span className="text-gold-400 font-heading font-bold text-lg">L</span>
          </div>
          <div>
            <span className="font-heading font-bold text-white tracking-tight text-xl block">LAWSAN SE</span>
            <span className="text-xs text-forest-400 uppercase tracking-widest font-bold">Admin Portal</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                  isActive ? 'text-forest-950 font-bold' : 'hover:bg-forest-900 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-bg" 
                    className="absolute inset-0 bg-gold-500 rounded-xl" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-forest-950' : 'text-forest-400 group-hover:text-gold-400'}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-forest-900">
          <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl w-full hover:bg-red-500/10 hover:text-red-400 transition-colors text-forest-400">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header (Desktop & Mobile) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-forest-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-10">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-900 rounded flex items-center justify-center">
              <span className="text-gold-400 font-heading font-bold text-sm">L</span>
            </div>
            <span className="font-heading font-bold text-forest-900">Admin</span>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-forest-900 capitalize">
              {pathname.split('/').pop() || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-600 hover:text-gold-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-forest-900 border-2 border-gold-400 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=0f3a1f&color=dcc673" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-32 md:pb-10 bg-forest-50/30">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-forest-950 border-t border-forest-900 pb-safe z-50">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 relative w-16"
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active" 
                    className="absolute top-0 w-8 h-1 bg-gold-500 rounded-b-full" 
                  />
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-forest-800' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'text-forest-500'}`} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-gold-400' : 'text-forest-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
