import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const tariffs = await prisma.tariff.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ tariffs });
  } catch (error) {
    console.error("Error fetching tariffs:", error);
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
      nameUz,
      nameRu,
      serviceType,
      price,
      periodUz,
      periodRu,
      durationMonths,
      featuresUz,
      featuresRu,
      isPopular,
      order,
      isActive,
    } = body;

    const tariff = await prisma.tariff.create({
      data: {
        nameUz,
        nameRu,
        serviceType: serviceType || "SMM",
        price,
        periodUz,
        periodRu,
        durationMonths: durationMonths ? Number(durationMonths) : null,
        featuresUz: typeof featuresUz === "string" ? featuresUz : JSON.stringify(featuresUz || []),
        featuresRu: typeof featuresRu === "string" ? featuresRu : JSON.stringify(featuresRu || []),
        isPopular: Boolean(isPopular),
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, tariff }, { status: 201 });
  } catch (error) {
    console.error("Error creating tariff:", error);
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
      nameUz,
      nameRu,
      serviceType,
      price,
      periodUz,
      periodRu,
      durationMonths,
      featuresUz,
      featuresRu,
      isPopular,
      order,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.tariff.update({
      where: { id },
      data: {
        nameUz,
        nameRu,
        serviceType,
        price,
        periodUz,
        periodRu,
        durationMonths: durationMonths ? Number(durationMonths) : null,
        featuresUz: typeof featuresUz === "string" ? featuresUz : JSON.stringify(featuresUz || []),
        featuresRu: typeof featuresRu === "string" ? featuresRu : JSON.stringify(featuresRu || []),
        isPopular: Boolean(isPopular),
        order: Number(order) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, tariff: updated });
  } catch (error) {
    console.error("Error updating tariff:", error);
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

    await prisma.tariff.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tariff:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
