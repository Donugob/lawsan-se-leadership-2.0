import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and /admin/setup
  if (pathname.startsWith("/admin")) {
    // Allow login page and setup links
    if (pathname === "/admin/login" || pathname.startsWith("/admin/setup")) {
      return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await decrypt(session);
      return NextResponse.next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
