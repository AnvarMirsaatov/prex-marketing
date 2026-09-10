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
      <section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand mb-3">
                {isUz ? "Ishonch & Hamkorlik" : "Доверие и партнёрство"}
              </span>
              <h1 className="text-display font-black tracking-tight text-ink leading-tight mb-6">
                {isUz ? "Bizning Hamkorlarimiz" : "Наши Партнёры"}
              </h1>
              <p className="text-lg text-muted leading-relaxed max-w-2xl">
                {isUz
                  ? "Biznesini yangi bosqichga olib chiqishda bizga ishonch bildirgan brendlar, korxonalar va loyihalar."
                  : "Бренды, компании и стартапы, доверившие нам стратегическое развитие маркетинга и продажи."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. PARTNERS GRID GALLERY */}
      <section className="bg-surface py-14 sm:py-20 border-y border-line">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
                {isUz ? "Galereya" : "Галерея брендов"}
              </span>
              <h2 className="text-heading font-black tracking-tight text-ink">
                {isUz ? "Hamkor kompaniyalar" : "Компании-партнёры"}
              </h2>
            </div>
            <p className="text-xs text-muted max-w-xs">
              {isUz
                ? "Har bir loyiha uchun alohida natijadorlik strategiyasi"
                : "Индивидуальная стратегия результативности для каждого бренда"}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="p-8 rounded-panel bg-paper border border-line flex flex-col items-center justify-center text-center interactive-card shadow-card group transition-all"
              >
                {/* Logo representation */}
                <div className="size-20 rounded-2xl bg-surface border border-line flex items-center justify-center text-brand font-black text-2xl mb-4 group-hover:scale-105 group-hover:bg-brand/10 transition-transform overflow-hidden relative">
                  {partner.logoUrl && partner.logoUrl !== "/partners/placeholder.svg" ? (
                    <Image
                      src={partner.logoUrl}
                      alt={isUz ? `${partner.name} logotipi` : `Логотип компании ${partner.name}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="size-8 text-brand" />
                  )}
                </div>

                <h3 className="font-bold text-ink text-lg">{partner.name}</h3>
                <span className="text-xs text-muted mt-1 font-mono">
                  Hamkor #{index + 1}
                </span>

                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    <span>Veb-saytga o'tish</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="mt-4 text-[11px] text-muted/80 flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-brand" />
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
            <h2 className="text-2xl font-black tracking-tight text-ink">
              {isUz ? "Biz ishlayotgan sohalar" : "Индустрии, с которыми мы работаем"}
            </h2>
            <p className="text-xs text-muted mt-2">
              {isUz
                ? "Turli sohalardagi bizneslar uchun moslashtirilgan tajriba va yechimlar"
                : "Практический опыт и кастомные решения для различных направлений бизнеса"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="p-6 rounded-card bg-surface border border-line text-center space-y-1"
              >
                <span className="text-3xl font-black text-brand block">{ind.count}</span>
                <span className="text-xs font-bold text-ink block">{ind.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CTA SECTION */}
      <section>
        <Container>
          <div className="p-8 sm:p-12 rounded-panel bg-ink text-paper relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4">
                <Shield className="size-3.5" />
                <span>{isUz ? "Hamkorlik" : "Сотрудничество"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                {isUz
                  ? "Siz ham bizning ishonchli hamkorimizga aylaning"
                  : "Станьте нашим партнером и масштабируйте свой бизнес"}
              </h2>
              <p className="text-sm text-paper/80 leading-relaxed">
                {isUz
                  ? "Loyihangiz bo'yicha konsultatsiya oling va raqamli marketing imkoniyatlaridan to'liq foydalaning."
                  : "Получите стратегическую консультацию и начните расти в продажах уже в этом месяце."}
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <ButtonLink
                href={`${localizedPath(locale, "home")}#consultation`}
                variant="secondary"
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
