import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define paths that require Admin authentication
  if (pathname.startsWith("/admin")) {
    // Exclude login and setup paths
    if (
      pathname === "/admin/login" || 
      pathname.startsWith("/admin/setup") ||
      pathname.startsWith("/admin/api/auth") // Allow auth APIs
    ) {
      return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const payload = await decrypt(session);
      if (!payload || !payload.admin) {
        throw new Error("Invalid session");
      }
      return NextResponse.next();
    } catch (error) {
      // Clear invalid cookie and redirect
      if (pathname.startsWith("/api/")) {
        const response = NextResponse.json({ error: "Invalid session" }, { status: 401 });
        response.cookies.delete("session");
        return response;
      }
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};
