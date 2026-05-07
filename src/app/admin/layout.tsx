import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // 1. Get the current URL from headers if needed, 
  // but for simple redirects, getSession() is enough.
  // The middleware also handles redirection, so this is second layer.
  
  // Note: We don't check for login/setup pages here because the middleware 
  // handles the path logic and this layout only wraps protected pages usually.
  // Actually, we need to check if the session exists for the layout to render properly.

  if (!session) {
    // We only redirect if we're not on the login/setup pages.
    // However, App Router layouts can be tricky with redirects.
    // Since this layout is in /admin, it wraps everything.
    // We should skip redirect logic if we're on login/setup.
    // But how to know the pathname in a server layout?
    // We can't easily without headers, but getSession() returning null 
    // is the indicator for unauthenticated.
    
    // We'll let the middleware handle the redirection to /admin/login.
    // Here we just render children (login page) without the admin nav.
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB]">
      <AdminNav user={session.admin} />
      
      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pb-32 lg:pb-12">
        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
