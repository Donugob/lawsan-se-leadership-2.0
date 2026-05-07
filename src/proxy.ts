import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/auth";

/**
 * Proxy (formerly Middleware) for Next.js 16
 * Renamed to proxy per Next.js 16 file convention requirements.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that require Admin authentication
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

  if (isAdminPath || isAdminApiPath) {
    // Exclude login and setup paths
    if (
      pathname === "/admin/login" || 
      pathname.startsWith("/admin/setup") ||
      pathname.startsWith("/api/admin/auth") // Allow auth APIs if any
    ) {
      return NextResponse.next();
    }

    const session = request.cookies.get("session")?.value;

    if (!session) {
      if (isAdminApiPath) {
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
      console.error("Session verification failed:", error);
      // Clear invalid cookie and redirect/return error
      if (isAdminApiPath) {
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
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};
