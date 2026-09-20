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
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("prox_admin_token")?.value;
    let isAuthenticated = false;
    let userRole = "admin";

    if (token) {
      try {
        const [data] = token.split(".");
        if (data) {
          const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
          if (payload && typeof payload.expiresAt === "number" && payload.expiresAt > Date.now()) {
            isAuthenticated = true;
            userRole = payload.role || "admin";
          }
        }
      } catch {
        isAuthenticated = false;
      }
    }

    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        const target = userRole === "super_admin" ? "/admin" : "/admin/leads";
        return NextResponse.redirect(new URL(target, request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete("prox_admin_token");
      }
      return response;
    }

    // Role-based route restriction: Admin (manager) ONLY has access to /admin/leads and /admin/security
    if (userRole === "admin" && pathname !== "/admin/leads" && pathname !== "/admin/security") {
      return NextResponse.redirect(new URL("/admin/leads", request.url));
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
