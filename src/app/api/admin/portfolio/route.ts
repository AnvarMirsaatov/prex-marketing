import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      titleUz,
      titleRu,
      descUz,
      descRu,
      imageUrl,
      category,
      clientName,
      projectUrl,
      order,
      isFeatured,
      isActive,
    } = body;

    const item = await prisma.portfolio.create({
      data: {
        titleUz,
        titleRu,
        descUz,
        descRu,
        imageUrl,
        category: category || "SMM",
        clientName: clientName || null,
        projectUrl: projectUrl || null,
        order: Number(order) || 0,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "PORTFOLIO_CREATED",
      "Portfolio",
      `${session.name} yangi '${item.titleUz}' portfolio keysini qo'shdi`
    );

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      titleUz,
      titleRu,
      descUz,
      descRu,
      imageUrl,
      category,
      clientName,
      projectUrl,
      order,
      isFeatured,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        titleUz,
        titleRu,
        descUz,
        descRu,
        imageUrl,
        category,
        clientName: clientName || null,
        projectUrl: projectUrl || null,
        order: Number(order) || 0,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "PORTFOLIO_UPDATED",
      "Portfolio",
      `${session.name} '${updated.titleUz}' portfolio keysini yangiladi`
    );

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Error updating portfolio:", error);
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

    const existing = await prisma.portfolio.findUnique({ where: { id } });
    await prisma.portfolio.delete({ where: { id } });

    if (existing) {
      await logAdminAction(
        session,
        "PORTFOLIO_DELETED",
        "Portfolio",
        `${session.name} '${existing.titleUz}' portfolio keysini o'chirdi`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
