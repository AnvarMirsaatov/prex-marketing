import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyAdminCredentials,
  setAdminSession,
  clearAdminSession,
  getAdminSession,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { action, username, password } = await request.json();

    if (action === "logout") {
      await clearAdminSession();
      return NextResponse.json({ success: true });
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Login va parolni kiriting" },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(username, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Login yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    await setAdminSession(admin);
    return NextResponse.json({ success: true, user: admin });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Avtorizatsiyada xatolik" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: { logoUrl: true, logoText: true },
  });
  return NextResponse.json({
    authenticated: true,
    user: session,
    logoUrl: settings?.logoUrl || null,
  });
}
