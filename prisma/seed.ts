import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      phone: "+998 20 026 04 18",
      phoneHref: "tel:+998200260418",
      instagram: "https://www.instagram.com/prox_uz/",
      instagramLabel: "@prox_uz",
      telegram: "https://t.me/manager_prox",
      telegramLabel: "@manager_prox",
      heroEyebrowUz: "Prox Marketing Agency",
      heroEyebrowRu: "Prox Marketing Agency",
      heroTitleUz: "Biznesingizni yangi bosqichga olib chiqamiz",
      heroTitleRu: "Выводим ваш бизнес на новый уровень",
      heroDescUz:
        "Prox — bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi.",
      heroDescRu:
        "Prox — digital-маркетинговое агентство, специализирующееся на системном развитии бизнеса в цифровой среде и увеличении продаж.",
      addressUz: "Toshkent shahri",
      addressRu: "город Ташкент",
      email: "info@proxmarketing.uz",
    },
  });

  // 2. Admin User
  const passwordHash = await bcrypt.hash("prox2026!", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      name: "Prox Administrator",
      role: "admin",
    },
  });

  // 3. Services (TZ 7.1 - 7.3)
  const servicesData = [
    {
      slug: "smm",
      category: "SMM",
      order: 1,
      titleUz: "SMM (Social Media Marketing)",
      titleRu: "SMM (Маркетинг в соцсетях)",
      descUz:
        "Strategiya ishlab chiqish, kontent yaratish, post va storilarni boshqarish, Instagram va Facebook platformalarida target reklamalar, brend imiji hamda har oylik analitika.",
      descRu:
        "Разработка стратегии, создание контента, ведение постов и сторис, таргетированная реклама в Instagram и Facebook, формирование имиджа бренда и ежемесячная аналитика.",
      icon: "Share2",
    },
    {
      slug: "marketing",
      category: "Marketing",
      order: 2,
      titleUz: "Kompleks Marketing",
      titleRu: "Комплексный маркетинг",
      descUz:
        "Target reklama (Google Ads, Telegram Ads), branding (logo, firma uslubi, brandbook), marketing konsalting, blogerlar (influencer marketing) va sotuv bo'limi nazorati.",
      descRu:
        "Таргетированная реклама (Google Ads, Telegram Ads), брендинг (лого, фирменный стиль, брендбук), маркетинговый консалтинг, инфлюенс-маркетинг и контроль отдела продаж.",
      icon: "TrendingUp",
    },
    {
      slug: "it",
      category: "IT",
      order: 3,
      titleUz: "IT va Raqamli Yechimlar",
      titleRu: "IT и цифровые решения",
      descUz:
        "Veb-saytlar (landing, korporativ sayt, internet-do'kon), iOS va Android mobil ilovalar, to'lov tizimlari integratsiyasi, UI/UX dizayn, texnik qo'llab-quvvatlash hamda AI Telegram botlar.",
      descRu:
        "Веб-сайты (landing page, корпоративные сайты, интернет-магазины), мобильные приложения для iOS/Android, интеграция платежей, UI/UX дизайн, техподдержка и AI Telegram-боты.",
      icon: "Code2",
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  // 4. Tariffs (TZ 8.1 - 8.3)
  const tariffsData = [
    {
      nameUz: "SMM — 1 oylik sinov paketi",
      nameRu: "SMM — Тестовый пакет на 1 месяц",
      serviceType: "SMM",
      price: "$1500",
      periodUz: "/ oy",
      periodRu: "/ месяц",
      durationMonths: 1,
      order: 1,
      isPopular: false,
      featuresUz: JSON.stringify([
        "Auditoriyani o'rganish va yo'l xaritasi",
        "Muntazam post va storislar",
        "Target reklama kreativlari",
        "Oylik hisobot va tahlil",
      ]),
      featuresRu: JSON.stringify([
        "Анализ аудитории и дорожная карта",
        "Регулярные посты и сторис",
        "Креативы для таргетированной рекламы",
        "Ежемесячный отчет и аналитика",
      ]),
    },
    {
      nameUz: "SMM — 3 oylik o'sish paketi",
      nameRu: "SMM — Пакет роста на 3 месяца",
      serviceType: "SMM",
      price: "$1350",
      periodUz: "/ oy",
      periodRu: "/ месяц",
      durationMonths: 3,
      order: 2,
      isPopular: true,
      featuresUz: JSON.stringify([
        "Chuqur marketing strategiyasi",
        "Professional video va motion dizayn",
        "Instagram & Facebook target kampaniyalari",
        "Brend imijini mustahkamlash",
        "Doimiy menejer ko'magi",
      ]),
      featuresRu: JSON.stringify([
        "Глубокая маркетинговая стратегия",
        "Профессиональное видео и моушн-дизайн",
        "Таргет-кампании в Instagram и Facebook",
        "Укрепление имиджа бренда",
        "Постоянная поддержка менеджера",
      ]),
    },
    {
      nameUz: "SMM — 6 oylik barqarorlik paketi",
      nameRu: "SMM — Пакет стабильности на 6 месяцев",
      serviceType: "SMM",
      price: "$1200",
      periodUz: "/ oy",
      periodRu: "/ месяц",
      durationMonths: 6,
      order: 3,
      isPopular: false,
      featuresUz: JSON.stringify([
        "To'liq SMM xizmatlari paketi",
        "Keng qamrovli reklama va kontent",
        "Influencerlar bilan dastlabki integratsiya",
        "A/B testlash va byudjet optimizatsiyasi",
        "Kengaytirilgan oylik hisobotlar",
      ]),
      featuresRu: JSON.stringify([
        "Полный пакет SMM-услуг",
        "Масштабная реклама и контент",
        "Интеграция с инфлюенсерами",
        "A/B тестирование и оптимизация бюджета",
        "Расширенная ежемесячная отчетность",
      ]),
    },
    {
      nameUz: "SMM — 1 yillik maksimal paket",
      nameRu: "SMM — Максимальный годовой пакет",
      serviceType: "SMM",
      price: "$1000",
      periodUz: "/ oy",
      periodRu: "/ месяц",
      durationMonths: 12,
      order: 4,
      isPopular: false,
      featuresUz: JSON.stringify([
        "Eng arzon oylik narx ($1000 / oy)",
        "Yillik strategik brending va rivojlanish",
        "To'liq kreativ jamoa va shaxsiy menejer",
        "Maksimal reklama samaradorligi",
        "Har choraklik strategik audit",
      ]),
      featuresRu: JSON.stringify([
        "Лучшая цена в месяц ($1000 / мес)",
        "Годовое стратегическое развитие бренда",
        "Выделенная креативная команда и менеджер",
        "Максимальная конверсия рекламы",
        "Ежеквартальный стратегический аудит",
      ]),
    },
    {
      nameUz: "Kompleks Marketing",
      nameRu: "Комплексный маркетинг",
      serviceType: "Marketing",
      price: "$2000 dan",
      periodUz: "/ loyiha",
      periodRu: "/ проект",
      durationMonths: null,
      order: 5,
      isPopular: false,
      featuresUz: JSON.stringify([
        "SMM xizmatlaridagi barcha imkoniyatlar",
        "Google Ads va Telegram Ads reklamalari",
        "Branding, logo, firma uslubi va brandbook",
        "Blogerlar bilan ishlash (Influencer marketing)",
        "Sotuv bo'limi nazorati va audit",
      ]),
      featuresRu: JSON.stringify([
        "Все возможности SMM-сопровождения",
        "Реклама в Google Ads и Telegram Ads",
        "Брендинг, логотип, фирменный стиль, брендбук",
        "Работа с блогерами (инфлюенс-маркетинг)",
        "Аудит и контроль отдела продаж",
      ]),
    },
    {
      nameUz: "IT va Dasturiy ta'minot",
      nameRu: "IT и разработка ПО",
      serviceType: "IT",
      price: "Individual smeta",
      periodUz: "/ loyiha",
      periodRu: "/ проект",
      durationMonths: null,
      order: 6,
      isPopular: false,
      featuresUz: JSON.stringify([
        "Veb-saytlar va Landing page yaratish",
        "iOS va Android mobil ilovalar",
        "To'lov tizimlari (Payme, Click, Uzum) integratsiyasi",
        "AI va Telegram botlar",
        "UI/UX dizayn va texnik ko'mak",
      ]),
      featuresRu: JSON.stringify([
        "Разработка веб-сайтов и Landing Page",
        "Мобильные приложения для iOS и Android",
        "Интеграция с Payme, Click, Uzum",
        "Telegram-боты и AI решения",
        "UI/UX дизайн и техническое сопровождение",
      ]),
    },
  ];

  for (const t of tariffsData) {
    const existing = await prisma.tariff.findFirst({
      where: { nameUz: t.nameUz },
    });
    if (!existing) {
      await prisma.tariff.create({ data: t });
    }
  }

  // 5. Initial Partners (Placeholders / Samples)
  const partnersData = [
    { name: "Apex Retail", logoUrl: "/partners/partner-1.svg", order: 1 },
    { name: "Nova Group", logoUrl: "/partners/partner-2.svg", order: 2 },
    { name: "SilkRoad Logistics", logoUrl: "/partners/partner-3.svg", order: 3 },
    { name: "FinTech Pro", logoUrl: "/partners/partner-4.svg", order: 4 },
    { name: "Grand Mart", logoUrl: "/partners/partner-5.svg", order: 5 },
    { name: "TechUz Solutions", logoUrl: "/partners/partner-6.svg", order: 6 },
  ];

  for (const p of partnersData) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({ data: p });
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
