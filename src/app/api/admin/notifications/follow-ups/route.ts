import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const isSuperAdmin = (session.role || "").toUpperCase() === "SUPER_ADMIN";
    const now = new Date();
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    // Filter bazasi
    const baseWhere: Prisma.LeadWhereInput = {
      followUpStatus: "PENDING",
      followUpDate: { not: null },
    };

    // Oddiy menejer faqat o'ziga biriktirilgan lidlarni ko'radi
    if (!isSuperAdmin) {
      baseWhere.assignedToId = session.userId;
    }

    // 1. Bugungi va muddati o'tganlar (Due & Overdue)
    const dueWhere: Prisma.LeadWhereInput = {
      ...baseWhere,
      followUpDate: { lte: endOfToday },
    };

    // 2. Kelgusi eslatmalar (Upcoming)
    const upcomingWhere: Prisma.LeadWhereInput = {
      ...baseWhere,
      followUpDate: { gt: endOfToday },
    };

    const [dueItems, dueCount, upcomingItems, upcomingCount] = await Promise.all([
      prisma.lead.findMany({
        where: dueWhere,
        orderBy: { followUpDate: "asc" },
        take: 20,
        select: {
          id: true,
          name: true,
          phone: true,
          serviceType: true,
          status: true,
          followUpDate: true,
          followUpNote: true,
          followUpStatus: true,
          followUpSetByName: true,
          assignedTo: {
            select: { id: true, name: true, username: true },
          },
        },
      }),
      prisma.lead.count({ where: dueWhere }),
      prisma.lead.findMany({
        where: upcomingWhere,
        orderBy: { followUpDate: "asc" },
        take: 10,
        select: {
          id: true,
          name: true,
          phone: true,
          serviceType: true,
          status: true,
          followUpDate: true,
          followUpNote: true,
          followUpStatus: true,
          followUpSetByName: true,
          assignedTo: {
            select: { id: true, name: true, username: true },
          },
        },
      }),
      prisma.lead.count({ where: upcomingWhere }),
    ]);

    return NextResponse.json({
      dueCount,
      upcomingCount,
      totalPending: dueCount + upcomingCount,
      dueItems,
      upcomingItems,
      isSuperAdmin,
    });
  } catch (error) {
    console.error("Error fetching follow-up notifications:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
