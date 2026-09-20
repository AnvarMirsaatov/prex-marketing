import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Hero slides GET error:", error);
    return NextResponse.json({ error: "Slaydlarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Faqat Super Admin slayd yarata oladi" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      titleUz,
      titleRu,
      descUz,
      descRu,
      badgeUz,
      badgeRu,
      imageUrl,
      buttonTextUz,
      buttonTextRu,
      serviceTarget,
      order,
      isActive,
    } = body;

    if (!titleUz || !titleRu || !descUz || !descRu) {
      return NextResponse.json(
        { error: "Sarlavha va tavsif (UZ va RU) to'ldirilishi shart" },
        { status: 400 }
      );
    }

    const slide = await prisma.heroSlide.create({
      data: {
        titleUz: titleUz.trim(),
        titleRu: titleRu.trim(),
        descUz: descUz.trim(),
        descRu: descRu.trim(),
        badgeUz: badgeUz?.trim() || null,
        badgeRu: badgeRu?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        buttonTextUz: buttonTextUz?.trim() || "Ariza qoldirish",
        buttonTextRu: buttonTextRu?.trim() || "Оставить заявку",
        serviceTarget: serviceTarget || "SMM",
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    try {
      revalidatePath("/uz");
      revalidatePath("/ru");
    } catch {}

    return NextResponse.json({ success: true, slide }, { status: 201 });
  } catch (error) {
    console.error("Hero slide POST error:", error);
    return NextResponse.json({ error: "Slayd yaratishda xatolik" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Faqat Super Admin tahrirlay oladi" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Support batch reordering: { reorder: [{ id, order }] }
    if (body.reorder && Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await prisma.heroSlide.update({
          where: { id: item.id },
          data: { order: Number(item.order) },
        });
      }

      try {
        revalidatePath("/uz");
        revalidatePath("/ru");
      } catch {}

      return NextResponse.json({ success: true, message: "Ketma-ketlik yangilandi" });
    }

    const {
      id,
      titleUz,
      titleRu,
      descUz,
      descRu,
      badgeUz,
      badgeRu,
      imageUrl,
      buttonTextUz,
      buttonTextRu,
      serviceTarget,
      order,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Slayd ID ko'rsatilmadi" }, { status: 400 });
    }

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...(titleUz ? { titleUz: titleUz.trim() } : {}),
        ...(titleRu ? { titleRu: titleRu.trim() } : {}),
        ...(descUz ? { descUz: descUz.trim() } : {}),
        ...(descRu ? { descRu: descRu.trim() } : {}),
        badgeUz: badgeUz?.trim() || null,
        badgeRu: badgeRu?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        ...(buttonTextUz ? { buttonTextUz: buttonTextUz.trim() } : {}),
        ...(buttonTextRu ? { buttonTextRu: buttonTextRu.trim() } : {}),
        ...(serviceTarget ? { serviceTarget } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    try {
      revalidatePath("/uz");
      revalidatePath("/ru");
    } catch {}

    return NextResponse.json({ success: true, slide: updated });
  } catch (error) {
    console.error("Hero slide PUT error:", error);
    return NextResponse.json({ error: "Slaydni yangilashda xatolik" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const role = (session.role || "").toUpperCase();
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Faqat Super Admin o'chira oladi" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Slayd ID ko'rsatilmadi" }, { status: 400 });
    }

    await prisma.heroSlide.delete({ where: { id } });

    try {
      revalidatePath("/uz");
      revalidatePath("/ru");
    } catch {}

    return NextResponse.json({ success: true, message: "Slayd o'chirildi" });
  } catch (error) {
    console.error("Hero slide DELETE error:", error);
    return NextResponse.json({ error: "Slaydni o'chirishda xatolik" }, { status: 500 });
  }
}
