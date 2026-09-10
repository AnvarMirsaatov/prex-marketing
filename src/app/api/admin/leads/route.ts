import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    let where = {};
    if (status && status !== "all") {
      if (status === "yakunlandi" || status === "yopildi") {
        where = { status: { in: ["yakunlandi", "yopildi"] } };
      } else {
        where = { status };
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      all: await prisma.lead.count(),
      yangi: await prisma.lead.count({ where: { status: "yangi" } }),
      korildi: await prisma.lead.count({ where: { status: "ko'rildi" } }),
      yakunlandi: await prisma.lead.count({ where: { status: { in: ["yakunlandi", "yopildi"] } } }),
    };

    return NextResponse.json({ leads, counts });
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
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID va status talab qilinadi" }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
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

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID talab qilinadi" }, { status: 400 });
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
