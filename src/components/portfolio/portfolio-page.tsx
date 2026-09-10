import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { localizedPath } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  Code2,
  Palette,
  ExternalLink,
  Layers,
} from "lucide-react";

export async function PortfolioPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  const portfolioItems = await prisma.portfolio.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const previewCategories = [
    {
      icon: BarChart3,
      title: isUz ? "SMM va Target keyslari" : "Кейсы по SMM и таргету",
      desc: isUz
        ? "Konversiyalar o'sishi, xarid narxining kamayishi va haqiqiy sotuv ko'rsatkichlari (ROAS)."
        : "Рост конверсий, снижение стоимости лида и реальные показатели окупаемости инвестиций (ROAS).",
    },
    {
      icon: Code2,
      title: isUz ? "Veb-saytlar va IT yechimlar" : "Сайты и IT-решения",
      desc: isUz
        ? "Ishlab chiqilgan tezkor korporativ saytlar, internet-do'konlar va Telegram botlar."
        : "Разработанные корпоративные сайты, интернет-магазины и масштабируемые чат-боты.",
    },
    {
      icon: Palette,
      title: isUz ? "Brending va Firma uslubi" : "Брендинг и айдентика",
      desc: isUz
        ? "Noldan yaratilgan logotiplar, brandbook va brendning vizual identifikatsiyasi."
        : "Созданные с нуля логотипы, брендбуки и запоминающаяся визуальная айдентика.",
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO BANNER */}
      <section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand mb-3">
                {isUz ? "Natijalar & Keyslar" : "Результаты и кейсы"}
              </span>
              <h1 className="text-display font-black tracking-tight text-ink leading-tight mb-6">
                {isUz ? "Portfolio / Keyslar" : "Портфолио / Кейсы"}
              </h1>
              <p className="text-lg text-muted leading-relaxed max-w-2xl">
                {isUz
                  ? "Bizneslarni raqamli makonda o'stirish bo'yicha amalga oshirilgan loyihalar va ularning aniq raqamlardagi natijalari."
                  : "Реализованные проекты по развитию бизнеса в digital-среде и их измеримые результаты в цифрах."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. MAIN CONTENT (COMING SOON OR ITEMS) */}
      <section className="bg-surface py-14 sm:py-20 border-y border-line">
        <Container>
          {portfolioItems.length === 0 ? (
            /* COMING SOON STATE (TZ 11 & 18) */
            <div className="max-w-3xl mx-auto">
              <div className="p-8 sm:p-14 rounded-panel bg-paper border border-line shadow-card text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="size-3.5 animate-pulse" />
                  <span>{isUz ? "Tez orada yangi keyslar joylanadi" : "Скоро будут опубликованы новые кейсы"}</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
                    {isUz
                      ? "Loyihalar hisobotlari tayyorlanmoqda"
                      : "Готовятся подробные отчеты по проектам"}
                  </h2>
                  <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
                    {isUz
                      ? "Hozirda mijozlarimiz bilan birgalikda erishilgan natijalarni raqamlar, infografikalar va skrinshotlar ko'rinishida rasmiylashtirmoqdamiz. Yaqin kunlarda barcha keyslar ushbu bo'limda to'liq taqdim etiladi."
                      : "В настоящее время мы оформляем результаты совместной работы с партнерами в виде наглядной аналитики и графиков. В ближайшее время все кейсы появятся в этом разделе."}
                  </p>
                </div>

                {/* Preview cards */}
                <div className="grid gap-4 sm:grid-cols-3 text-left pt-4">
                  {previewCategories.map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-card bg-surface border border-line/80 flex flex-col justify-between"
                      >
                        <div>
                          <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
                            <Icon className="size-5" />
                          </div>
                          <h3 className="font-bold text-ink text-sm mb-1.5">{cat.title}</h3>
                          <p className="text-[11px] text-muted leading-relaxed">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-line/60 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <span className="text-xs text-muted">
                    {isUz
                      ? "O'z biznesingiz keysini biz bilan yaratmoqchimisiz?"
                      : "Хотите создать успешный кейс вместе с нами?"}
                  </span>
                  <ButtonLink href={`${localizedPath(locale, "home")}#consultation`}>
                    <span>{isUz ? "Konsultatsiya olish" : "Получить консультацию"}</span>
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE ITEMS GRID (When added in Admin) */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-panel bg-paper border border-line overflow-hidden shadow-card interactive-card flex flex-col justify-between group"
                >
                  {item.imageUrl && (
                    <div className="h-48 w-full overflow-hidden bg-surface relative">
                      <Image
                        src={item.imageUrl}
                        alt={isUz ? `${item.titleUz} keysi rasmi` : `Кейс проекта ${item.titleRu}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-brand/10 text-brand">
                        {item.category}
                      </span>
                      {item.clientName && (
                        <span className="text-xs text-muted font-medium">{item.clientName}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-ink mb-2">
                      {isUz ? item.titleUz : item.titleRu}
                    </h3>
                    <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                      {isUz ? item.descUz : item.descRu}
                    </p>
                  </div>

                  {item.projectUrl && (
                    <div className="p-4 bg-surface border-t border-line">
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                      >
                        <span>{isUz ? "Loyihani ko'rish" : "Посмотреть проект"}</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 3. BOTTOM CTA */}
      <section>
        <Container>
          <div className="p-8 sm:p-12 rounded-panel bg-ink text-paper relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4">
                <Layers className="size-3.5" />
                <span>{isUz ? "Hamkorlik" : "Сотрудничество"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                {isUz
                  ? "Loyihangiz bo'yicha hisob-kitob kerakmi?"
                  : "Нужен предварительный расчет вашего проекта?"}
              </h2>
              <p className="text-sm text-paper/80 leading-relaxed">
                {isUz
                  ? "Mutaxassisimiz bilan bog'laning va bepul smeta hamda rivojlanish rejasiga ega bo'ling."
                  : "Свяжитесь с нами и получите бесплатную смету и стратегию развития вашего бизнеса."}
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <ButtonLink
                href={`${localizedPath(locale, "home")}#consultation`}
                variant="secondary"
                className="shadow-lg"
              >
                <span>{isUz ? "Smeta olish" : "Получить смету"}</span>
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
