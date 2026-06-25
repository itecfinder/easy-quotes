import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example: check for a session token in cookies
  const token = request.cookies.get("token")?.value;

  // Protect dashboard routes
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If user is NOT logged in and tries to access dashboard → redirect
  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user IS logged in and tries to access login → redirect to dashboard
  if (pathname === "/login" && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
