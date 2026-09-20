import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";

const SECRET = process.env.ADMIN_SESSION_SECRET || "prox_marketing_session_secret_2026_xyz";

interface AdminTokenPayload {
  userId: string;
  username: string;
  role: string;
  name: string;
  expiresAt: number;
}

async function verifyToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const b64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
    if (!isValid) return null;

    const dataB64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const dataPadded = dataB64.length % 4 ? dataB64 + "=".repeat(4 - (dataB64.length % 4)) : dataB64;
    const jsonStr = decodeURIComponent(
      Array.from(atob(dataPadded))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload: AdminTokenPayload = JSON.parse(jsonStr);

    if (!payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
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
    const session = token ? await verifyToken(token) : null;
    const userRole = (session?.role || "").toUpperCase();
    const isSuperAdmin = userRole === "SUPER_ADMIN";
    const isAdminManager = userRole === "ADMIN";

    if (pathname === "/admin/login") {
      if (session) {
        const target = isSuperAdmin ? "/admin" : "/admin/leads";
        return NextResponse.redirect(new URL(target, request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete("prox_admin_token");
      }
      return response;
    }

    // Role-based route restriction: ADMIN (manager) ONLY has access to /admin/leads and /admin/security
    if (isAdminManager && pathname !== "/admin/leads" && pathname !== "/admin/security") {
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
