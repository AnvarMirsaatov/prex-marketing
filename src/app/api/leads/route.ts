import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, serviceType, message, comment, website_hp, honeypot } = body;

    // 1. Spam protection via honeypot (if filled, silently drop for bots)
    if (website_hp || honeypot) {
      return NextResponse.json(
        {
          success: true,
          message: "So'rovingiz muvaffaqiyatli qabul qilindi!",
        },
        { status: 200 }
      );
    }

    // 2. Name validation (mandatory)
    const leadName = (name || "").trim();
    if (!leadName) {
      return NextResponse.json(
        { error: "Ismingizni kiritishingiz shart." },
        { status: 400 }
      );
    }

    // 3. Phone validation (mandatory, Uzbekistan format: +998...)
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits || digits.length !== 12 || !digits.startsWith("998")) {
      return NextResponse.json(
        {
          error:
            "Telefon raqami noto'g'ri kiritildi. O'zbekiston formati: +998 XX XXX XX XX",
        },
        { status: 400 }
      );
    }

    const formattedPhone = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
    const leadComment = (comment || message || "").trim();
    const service = (serviceType || "SMM").trim();

    // 4. Save to Database with status "yangi"
    const lead = await prisma.lead.create({
      data: {
        name: leadName,
        phone: formattedPhone,
        serviceType: service,
        comment: leadComment || null,
        status: "yangi",
        source: "website_form",
      },
    });

    // 5. Telegram Bot notification in exact requested format
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "default" },
      });

      const token = process.env.TELEGRAM_BOT_TOKEN || settings?.telegramBotToken;
      const chatId = process.env.TELEGRAM_CHAT_ID || settings?.telegramChatId;

      if (token && chatId) {
        const text = [
          "🔔 Yangi so'rov!",
          `👤 Ism: ${leadName}`,
          `📞 Tel: ${formattedPhone}`,
          `📌 Xizmat: ${service}`,
          `💬 Xabar: ${leadComment || "Ko'rsatilmagan"}`,
        ].join("\n");

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        }).catch((err) => console.error("Telegram API call error:", err));
      }
    } catch (tgErr) {
      console.error("Telegram notification error:", tgErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "So'rovingiz muvaffaqiyatli qabul qilindi!",
        lead: {
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          serviceType: lead.serviceType,
          status: lead.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}

