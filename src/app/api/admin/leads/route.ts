import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import type { Prisma } from "@prisma/client";
import crypto from "crypto";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const assigned = searchParams.get("assigned");
  const followUp = searchParams.get("followUp");

  try {
    const where: Prisma.LeadWhereInput = {};
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

    if (status && status !== "all") {
      if (status === "yakunlandi" || status === "yopildi") {
        where.status = { in: ["yakunlandi", "yopildi"] };
      } else if (status === "qayta_bog'lanish" || status === "qayta_boglanish" || status === "follow_up") {
        where.status = "qayta_bog'lanish";
      } else {
        where.status = status;
      }
    }

    if (followUp === "due") {
      where.followUpStatus = "PENDING";
      where.followUpDate = { lte: endOfToday };
    } else if (followUp === "pending") {
      where.followUpStatus = "PENDING";
    }

    if (assigned === "mine") {
      where.assignedToId = session.userId;
    } else if (assigned === "unassigned") {
      where.assignedToId = null;
    } else if (assigned && assigned !== "all") {
      where.assignedToId = assigned;
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, username: true, role: true },
        },
        lastActionBy: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });

    const isSuper = (session.role || "").toUpperCase() === "SUPER_ADMIN";

    const counts = {
      all: await prisma.lead.count(),
      yangi: await prisma.lead.count({ where: { status: "yangi" } }),
      qayta_boglanish: await prisma.lead.count({ where: { status: "qayta_bog'lanish" } }),
      korildi: await prisma.lead.count({ where: { status: "ko'rildi" } }),
      yakunlandi: await prisma.lead.count({ where: { status: { in: ["yakunlandi", "yopildi"] } } }),
      mine: await prisma.lead.count({ where: { assignedToId: session.userId } }),
      unassigned: await prisma.lead.count({ where: { assignedToId: null } }),
      followUpDue: await prisma.lead.count({
        where: {
          followUpStatus: "PENDING",
          followUpDate: { lte: endOfToday },
          ...(isSuper ? {} : { assignedToId: session.userId }),
        },
      }),
    };

    return NextResponse.json({ leads, counts, currentUser: session });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, assignedToId, note } = body;

    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, username: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lid topilmadi" }, { status: 404 });
    }

    const updateData: Prisma.LeadUpdateInput = {
      lastActionBy: { connect: { id: session.userId } },
      lastActionAt: new Date(),
    };

    // 1. Status o'zgartirish
    if (status !== undefined && status !== existing.status) {
      updateData.status = status;
      await logAdminAction(
        session,
        "LID_STATUS_UPDATED",
        "Leads",
        `${session.name} '${existing.name}' (${existing.phone}) lid statusini '${status}' ga o'zgartirdi`
      );
    }

    // 2. Biriktirish / Mas'ul adminni o'zgartirish
    if (assignedToId !== undefined) {
      const newAssignedId = assignedToId === null || assignedToId === "" ? null : assignedToId;
      if (newAssignedId) {
        updateData.assignedTo = { connect: { id: newAssignedId } };
      } else {
        updateData.assignedTo = { disconnect: true };
      }

      if (newAssignedId) {
        const assignedAdmin = await prisma.adminUser.findUnique({
          where: { id: newAssignedId },
          select: { name: true, username: true },
        });
        const targetName = assignedAdmin ? `${assignedAdmin.name} (@${assignedAdmin.username})` : newAssignedId;
        await logAdminAction(
          session,
          "LID_ASSIGNED",
          "Leads",
          `${session.name} '${existing.name}' lidini ${targetName} ga biriktirdi`
        );
      } else {
        await logAdminAction(
          session,
          "LID_UNASSIGNED",
          "Leads",
          `${session.name} '${existing.name}' lididan mas'ul biriktiruvini bekor qildi`
        );
      }
    }

    // 3. Ichki izoh (Note) qo'shish
    if (note && typeof note === "string" && note.trim().length > 0) {
      interface LeadNoteItem {
        id: string;
        text: string;
        authorId: string;
        authorName: string;
        authorRole: string;
        createdAt: string;
      }
      let existingNotes: LeadNoteItem[] = [];
      try {
        if (existing.notes) {
          existingNotes = JSON.parse(existing.notes) as LeadNoteItem[];
          if (!Array.isArray(existingNotes)) existingNotes = [];
        }
      } catch {
        existingNotes = [];
      }

      const newNote = {
        id: crypto.randomUUID(),
        text: note.trim(),
        authorId: session.userId,
        authorName: session.name,
        authorRole: session.role,
        createdAt: new Date().toISOString(),
      };

      existingNotes.unshift(newNote);
      updateData.notes = JSON.stringify(existingNotes);

      await logAdminAction(
        session,
        "LID_NOTE_ADDED",
        "Leads",
        `${session.name} '${existing.name}' lidga ichki izoh qoldirdi: "${note.trim().slice(0, 60)}${note.trim().length > 60 ? "..." : ""}"`
      );
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, username: true, role: true },
        },
        lastActionBy: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Kirish taqiqlangan. Lidni faqat Super Admin o'chira oladi." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.lead.findUnique({
      where: { id },
    });

    if (existing) {
      await logAdminAction(
        session,
        "LID_DELETED",
        "Leads",
        `${session.name} '${existing.name}' (${existing.phone}) lidini o'chirib tashladi`
      );
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
