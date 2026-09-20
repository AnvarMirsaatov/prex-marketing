import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";
import crypto from "crypto";

interface LeadNoteItem {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

function parseNotes(notesStr: string | null): LeadNoteItem[] {
  if (!notesStr) return [];
  try {
    const parsed = JSON.parse(notesStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// POST: Qayta bog'lanish (Follow-up) belgilash
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, followUpDate, followUpNote } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Lid ID talab qilinadi" }, { status: 400 });
    }

    // 1. Sana tekshiruvi
    if (!followUpDate) {
      return NextResponse.json(
        { error: "Qayta bog'lanish sanasi va vaqtini tanlang" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(followUpDate);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Noto'g'ri sana formati" },
        { status: 400 }
      );
    }

    // 5 daqiqa margin bilan o'tgan zamon tekshiruvi
    if (scheduledDate.getTime() < Date.now() - 5 * 60 * 1000) {
      return NextResponse.json(
        { error: "O'tgan sana va vaqtni tanlab bo'lmaydi. Kelgusi vaqtni tanlang!" },
        { status: 400 }
      );
    }

    // 2. Suhbat mazmuni va reja tekshiruvi (MAJBURIY)
    if (!followUpNote || typeof followUpNote !== "string" || followUpNote.trim().length === 0) {
      return NextResponse.json(
        { error: "Iltimos, suhbat mazmuni va qayta qo'ng'iroq rejasini yozing!" },
        { status: 400 }
      );
    }

    const existing = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lid topilmadi" }, { status: 404 });
    }

    const formattedDate = scheduledDate.toLocaleString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Ichki izohlar tarixiga qo'shish
    const notes = parseNotes(existing.notes);
    notes.unshift({
      id: crypto.randomUUID(),
      text: `📅 Qayta bog'lanish belgilandi: ${formattedDate}\nReja: ${followUpNote.trim()}`,
      authorId: session.userId,
      authorName: session.name,
      authorRole: session.role,
      createdAt: new Date().toISOString(),
    });

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "qayta_bog'lanish",
        followUpDate: scheduledDate,
        followUpNote: followUpNote.trim(),
        followUpStatus: "PENDING",
        followUpSetById: session.userId,
        followUpSetByName: session.name,
        followUpCompletedAt: null,
        followUpCompletedById: null,
        followUpCompletedByName: null,
        lastActionById: session.userId,
        lastActionAt: new Date(),
        // Agar hali biriktirilmagan bo'lsa, eslatma o'rnatgan adminga avtomatik biriktiriladi
        assignedToId: existing.assignedToId || session.userId,
        notes: JSON.stringify(notes),
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, username: true, role: true },
        },
        lastActionBy: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });

    const notePreview =
      followUpNote.trim().length > 60
        ? followUpNote.trim().slice(0, 60) + "..."
        : followUpNote.trim();

    await logAdminAction(
      session,
      "LEAD_FOLLOW_UP_SCHEDULED",
      "Leads",
      `${session.name} '${existing.name}' (${existing.phone}) uchun ${formattedDate} ga qayta bog'lanish belgiladi. Reja: "${notePreview}"`
    );

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error scheduling follow-up:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

// PATCH: Qayta bog'lanishni "Bajarildi" deb belgilash
export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { leadId, resultNote, nextStatus } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Lid ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Lid topilmadi" }, { status: 404 });
    }

    const statusToSet = nextStatus || "ko'rildi";

    // Agar natija izohi kiritilgan bo'lsa, tarixga saqlash
    const notes = parseNotes(existing.notes);
    if (resultNote && typeof resultNote === "string" && resultNote.trim().length > 0) {
      notes.unshift({
        id: crypto.randomUUID(),
        text: `✅ Qayta bog'lanish bajarildi (${new Date().toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        })})\nNatija: ${resultNote.trim()}`,
        authorId: session.userId,
        authorName: session.name,
        authorRole: session.role,
        createdAt: new Date().toISOString(),
      });
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        followUpStatus: "COMPLETED",
        followUpCompletedAt: new Date(),
        followUpCompletedById: session.userId,
        followUpCompletedByName: session.name,
        status: statusToSet,
        lastActionById: session.userId,
        lastActionAt: new Date(),
        notes: JSON.stringify(notes),
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, username: true, role: true },
        },
        lastActionBy: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });

    const resultPreview =
      resultNote && resultNote.trim().length > 0
        ? `Natija: "${resultNote.trim().slice(0, 60)}${resultNote.trim().length > 60 ? "..." : ""}"`
        : "Natija izohsiz yakunlandi";

    await logAdminAction(
      session,
      "LEAD_FOLLOW_UP_COMPLETED",
      "Leads",
      `${session.name} '${existing.name}' bilan qayta bog'lanishni bajardi. Yangi status: '${statusToSet}'. ${resultPreview}`
    );

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Error completing follow-up:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
