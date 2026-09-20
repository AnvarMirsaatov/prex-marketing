import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { localizedPath } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import { Building2, ExternalLink, ArrowRight, CheckCircle2, Shield } from "lucide-react";

export async function PartnersPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const industries = [
    { name: isUz ? "Retail & Do'konlar" : "Ритейл и магазины", count: "15+" },
    { name: isUz ? "HoReCa & Restoranlar" : "HoReCa и рестораны", count: "10+" },
    { name: isUz ? "IT & Startaplar" : "IT и стартапы", count: "8+" },
    { name: isUz ? "B2B & Xizmatlar" : "B2B и сервисы", count: "12+" },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO BANNER */}
      <section className="relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 size-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Shield className="size-3.5" />
                <span>{isUz ? "Ishonch & Hamkorlik" : "Доверие и партнёрство"}</span>
              </span>
              <h1 className="text-display font-black tracking-tight text-white leading-tight mb-5">
                {isUz ? "Bizning Hamkorlarimiz" : "Наши Партнёры"}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                {isUz
                  ? "Biznesini yangi bosqichga olib chiqishda bizga ishonch bildirgan brendlar, korxonalar va loyihalar."
                  : "Бренды, компании и стартапы, доверившие нам стратегическое развитие маркетинга и продажи."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. PARTNERS GRID GALLERY */}
      <section className="bg-gradient-to-b from-transparent via-[#070e1d] to-transparent py-14 sm:py-20 border-y border-blue-500/15">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
                {isUz ? "Galereya" : "Галерея брендов"}
              </span>
              <h2 className="text-heading font-black tracking-tight text-white">
                {isUz ? "Hamkor kompaniyalar" : "Компании-партнёры"}
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xs">
              {isUz
                ? "Har bir loyiha uchun alohida natijadorlik strategiyasi"
                : "Индивидуальная стратегия результативности для каждого бренда"}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="p-8 rounded-3xl bg-[#0a1326]/80 backdrop-blur-md border border-blue-500/15 flex flex-col items-center justify-center text-center interactive-card shadow-[0_10px_35px_-10px_rgba(2,6,23,0.7)] group transition-all relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                {/* Logo representation */}
                <div className="size-20 rounded-2xl bg-[#0d1a36] border border-blue-500/20 flex items-center justify-center text-sky-400 font-black text-2xl mb-4 group-hover:scale-105 group-hover:border-blue-500/40 group-hover:bg-[#102247] transition-all overflow-hidden relative shadow-inner">
                  {partner.logoUrl && partner.logoUrl !== "/partners/placeholder.svg" ? (
                    <Image
                      src={partner.logoUrl}
                      alt={isUz ? `${partner.name} logotipi` : `Логотип компании ${partner.name}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="size-8 text-sky-400" />
                  )}
                </div>

                <h3 className="font-bold text-white text-lg">{partner.name}</h3>
                <span className="text-xs text-slate-400 mt-1 font-mono">
                  Hamkor #{index + 1}
                </span>

                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:underline"
                  >
                    <span>Veb-saytga o'tish</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-sky-400" />
                    <span>{isUz ? "Tasdiqlangan hamkor" : "Проверенный партнёр"}</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. INDUSTRIES */}
      <section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black tracking-tight text-white">
              {isUz ? "Biz ishlayotgan sohalar" : "Индустрии, с которыми мы работаем"}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {isUz
                ? "Turli sohalardagi bizneslar uchun moslashtirilgan tajriba va yechimlar"
                : "Практический опыт и кастомные решения для различных направлений бизнеса"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0a1326]/80 backdrop-blur-md border border-blue-500/15 text-center space-y-1 hover:border-blue-500/30 transition-colors"
              >
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300 block">{ind.count}</span>
                <span className="text-xs font-bold text-slate-200 block">{ind.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CTA SECTION */}
      <section>
        <Container>
          <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d1b38] via-[#0f224a] to-[#0a152e] border border-blue-500/25 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Shield className="size-3.5" />
                <span>{isUz ? "Hamkorlik" : "Сотрудничество"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                {isUz
                  ? "Siz ham bizning ishonchli hamkorimizga aylaning"
                  : "Станьте нашим партнером и масштабируйте свой бизнес"}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isUz
                  ? "Loyihangiz bo'yicha konsultatsiya oling va raqamli marketing imkoniyatlaridan to'liq foydalaning."
                  : "Получите стратегическую консультацию и начните расти в продажах уже в этом месяце."}
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <ButtonLink
                href={`${localizedPath(locale, "home")}#consultation`}
                variant="primary"
                className="shadow-lg"
              >
                <span>{isUz ? "Hamkor bo'lish" : "Стать партнёром"}</span>
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
