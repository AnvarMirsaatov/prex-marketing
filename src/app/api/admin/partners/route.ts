import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const { name, logoUrl, websiteUrl, order, isActive } = await request.json();

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        websiteUrl: websiteUrl || null,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "PARTNER_CREATED",
      "Partners",
      `${session.name} yangi '${partner.name}' hamkorini qo'shdi`
    );

    return NextResponse.json({ success: true, partner }, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const { id, name, logoUrl, websiteUrl, order, isActive } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.partner.update({
      where: { id },
      data: {
        name,
        logoUrl,
        websiteUrl: websiteUrl || null,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "PARTNER_UPDATED",
      "Partners",
      `${session.name} '${updated.name}' hamkor ma'lumotlarini yangiladi`
    );

    return NextResponse.json({ success: true, partner: updated });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.partner.findUnique({ where: { id } });
    await prisma.partner.delete({ where: { id } });

    if (existing) {
      await logAdminAction(
        session,
        "PARTNER_DELETED",
        "Partners",
        `${session.name} '${existing.name}' hamkorini o'chirdi`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
