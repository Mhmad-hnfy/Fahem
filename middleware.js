import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ─── Protect /admin/* routes ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("fahem_role")?.value;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
