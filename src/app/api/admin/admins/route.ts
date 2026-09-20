import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  try {
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ admins, currentUser: session });
  } catch (error) {
    console.error("Admins list error:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
