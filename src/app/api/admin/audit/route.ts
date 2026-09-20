import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  if ((session.role || "").toUpperCase() !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Kirish taqiqlangan. Ushbu ma'lumotlar faqat Bosh Administrator (Super Admin) uchun ochiq." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity");
  const userId = searchParams.get("userId");
  const search = searchParams.get("search")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
  const skip = (page - 1) * limit;

  try {
    const where: Prisma.AuditLogWhereInput = {};

    if (entity && entity !== "all") {
      where.entity = entity;
    }

    if (userId && userId !== "all") {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { details: { contains: search } },
        { userName: { contains: search } },
        { action: { contains: search } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error("Audit log GET error:", error);
    return NextResponse.json({ error: "Audit jurnallarini olishda xatolik yuz berdi" }, { status: 500 });
  }
}
