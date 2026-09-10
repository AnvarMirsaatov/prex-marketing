import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal next requests, static assets, and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect admin panel (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("prox_admin_token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Root domain redirect to /uz
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/uz", request.url));
  }

  // Validate locale for client-facing routes
  if (!pathname.startsWith("/admin")) {
    const locale = pathname.split("/")[1];
    if (locale && !isLocale(locale)) {
      return new NextResponse("404", { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
