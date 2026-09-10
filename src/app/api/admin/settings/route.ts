import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
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
      phone,
      phoneHref,
      instagram,
      instagramLabel,
      telegram,
      telegramLabel,
      heroEyebrowUz,
      heroEyebrowRu,
      heroTitleUz,
      heroTitleRu,
      heroDescUz,
      heroDescRu,
      addressUz,
      addressRu,
      email,
      telegramBotToken,
      telegramChatId,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        phone,
        phoneHref: phoneHref || `tel:${(phone || "").replace(/[^\d+]/g, "")}`,
        instagram,
        instagramLabel,
        telegram,
        telegramLabel,
        heroEyebrowUz,
        heroEyebrowRu,
        heroTitleUz,
        heroTitleRu,
        heroDescUz,
        heroDescRu,
        addressUz,
        addressRu,
        email,
        telegramBotToken,
        telegramChatId,
      },
      create: {
        id: "default",
        phone: phone || "+998 20 026 04 18",
        phoneHref: phoneHref || "tel:+998200260418",
        instagram: instagram || "https://www.instagram.com/prox_uz/",
        instagramLabel: instagramLabel || "@prox_uz",
        telegram: telegram || "https://t.me/manager_prox",
        telegramLabel: telegramLabel || "@manager_prox",
        heroEyebrowUz: heroEyebrowUz || "Prox Marketing Agency",
        heroEyebrowRu: heroEyebrowRu || "Prox Marketing Agency",
        heroTitleUz: heroTitleUz || "Biznesingizni yangi bosqichga olib chiqamiz",
        heroTitleRu: heroTitleRu || "Выводим ваш бизнес на новый уровень",
        heroDescUz: heroDescUz || "Prox — digital marketing agentligi.",
        heroDescRu: heroDescRu || "Prox — агентство цифрового маркетинга.",
        addressUz,
        addressRu,
        email,
        telegramBotToken,
        telegramChatId,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
