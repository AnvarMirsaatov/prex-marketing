import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
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
      { error: "Kirish taqiqlangan. Faqat Super Admin xizmat yarata oladi." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { slug, category, titleUz, titleRu, descUz, descRu, icon, order, isActive } = body;

    const service = await prisma.service.create({
      data: {
        slug,
        category: category || "SMM",
        titleUz,
        titleRu,
        descUz,
        descRu,
        icon,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "SERVICE_CREATED",
      "Services",
      `${session.name} yangi '${service.titleUz}' xizmatini qo'shdi`
    );

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
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
      { error: "Kirish taqiqlangan. Faqat Super Admin xizmatni o'zgartira oladi." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, slug, category, titleUz, titleRu, descUz, descRu, icon, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        slug,
        category,
        titleUz,
        titleRu,
        descUz,
        descRu,
        icon,
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAdminAction(
      session,
      "SERVICE_UPDATED",
      "Services",
      `${session.name} '${updated.titleUz}' xizmatini yangiladi`
    );

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Error updating service:", error);
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
      { error: "Kirish taqiqlangan. Faqat Super Admin xizmatni o'chira oladi." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const existing = await prisma.service.findUnique({ where: { id } });
    await prisma.service.delete({ where: { id } });

    if (existing) {
      await logAdminAction(
        session,
        "SERVICE_DELETED",
        "Services",
        `${session.name} '${existing.titleUz}' xizmatini o'chirdi`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
