import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Kirish taqiqlangan. Faqat Super Admin jamoa a'zosi qo'sha oladi." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, roleUz, roleRu, bioUz, bioRu, imageUrl, socialLinks, order, isActive } = body;

    const member = await prisma.teamMember.create({
      data: {
        name,
        roleUz,
        roleRu,
        bioUz,
        bioRu,
        imageUrl: imageUrl || null,
        socialLinks: typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks || {}),
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "TEAM_MEMBER_CREATED",
      "Team",
      `${session.name} yangi '${member.name}' jamoa a'zosini qo'shdi`
    );

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Kirish taqiqlangan. Faqat Super Admin jamoa a'zosi ma'lumotlarini o'zgartira oladi." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, name, roleUz, roleRu, bioUz, bioRu, imageUrl, socialLinks, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        roleUz,
        roleRu,
        bioUz,
        bioRu,
        imageUrl: imageUrl || null,
        socialLinks: typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks || {}),
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "TEAM_MEMBER_UPDATED",
      "Team",
      `${session.name} '${updated.name}' jamoa a'zosi ma'lumotlarini yangiladi`
    );

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("Error updating team member:", error);
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
      { error: "Kirish taqiqlangan. Faqat Super Admin jamoa a'zosini o'chira oladi." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    await prisma.teamMember.delete({ where: { id } });

    if (existing) {
      await logAdminAction(
        session,
        "TEAM_MEMBER_DELETED",
        "Team",
        `${session.name} '${existing.name}' jamoa a'zosini o'chirdi`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
