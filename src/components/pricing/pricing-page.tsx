import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ConsultationForm } from "@/components/home/consultation-form";
import { prisma } from "@/lib/prisma";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  Check,
  Sparkles,
  ArrowRight,
  Phone,
  Send,
  HelpCircle,
} from "lucide-react";

export async function PricingPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  // Fetch tariffs directly from database (TZ requirement: all pricing editable via admin)
  const dbTariffs = await prisma.tariff.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const smmTariffs = dbTariffs.filter((t) => t.serviceType === "SMM");
  const marketingTariffs = dbTariffs.filter((t) => t.serviceType === "Marketing");
  const itTariffs = dbTariffs.filter((t) => t.serviceType === "IT");

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO BANNER */}
      <section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand mb-3">
                {isUz ? "TZ 8-bo'lim &bull; Shaffof Narxlar" : "Раздел 8 ТЗ &bull; Прозрачные тарифы"}
              </span>
              <h1 className="text-display font-black tracking-tight text-ink leading-tight mb-6">
                {isUz ? "Tariflar va Narxlar Jadvali" : "Тарифы и Стоимость Услуг"}
              </h1>
              <p className="text-lg sm:text-xl text-ink font-medium leading-relaxed mb-4">
                {isUz
                  ? "Biznesingiz ko'lami va maqsadlariga mos shaffof hamda qulay paketlar"
                  : "Прозрачные и понятные пакеты под масштабы и цели вашего бизнеса"}
              </p>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {isUz
                  ? "Yashirin to'lovlarsiz. Barcha tariflar bo'yicha shartnomalar tuziladi va har oy yakunida batafsil hisobot topshiriladi."
                  : "Никаких скрытых платежей. По всем тарифам заключаются официальные договоры с ежемесячной отчетностью."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. SMM TARIFFS GRID (TZ 8.1) */}
      <section id="smm-tariffs" className="scroll-mt-8">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
                {isUz ? "TZ 8.1-band" : "Пункт 8.1 ТЗ"}
              </span>
              <h2 className="text-heading font-black tracking-tight text-ink">
                {isUz ? "SMM xizmati narxlari" : "Стоимость SMM-услуг"}
              </h2>
            </div>
            <p className="text-xs text-muted max-w-xs">
              {isUz
                ? "Uzoq muddatli paketlarda oylik to'lov sezilarli darajada arzonlashadi"
                : "При заказе долгосрочных пакетов стоимость месяца существенно снижается"}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {smmTariffs.map((t) => {
              let features: string[] = [];
              try {
                features = JSON.parse(isUz ? t.featuresUz : t.featuresRu);
              } catch {
                features = [];
              }

              return (
                <div
                  key={t.id}
                  className={`p-6 sm:p-8 rounded-panel border flex flex-col justify-between transition-all relative ${
                    t.isPopular
                      ? "bg-slate-950 text-white border-brand shadow-xl scale-[1.02] ring-2 ring-brand/20"
                      : "bg-paper text-ink border-line shadow-card hover:border-brand/40"
                  }`}
                >
                  {t.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {isUz ? "Eng ommabop tanlov" : "Популярный выбор"}
                    </div>
                  )}

                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                        t.isPopular ? "text-accent" : "text-brand"
                      }`}
                    >
                      {isUz ? t.nameUz : t.nameRu}
                    </span>

                    <div className="my-5 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black">{t.price}</span>
                      <span
                        className={`text-xs font-semibold ${
                          t.isPopular ? "text-white/70" : "text-muted"
                        }`}
                      >
                        {isUz ? t.periodUz : t.periodRu}
                      </span>
                    </div>

                    <ul className="space-y-3 pt-4 border-t border-line/40 text-xs mb-8">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check
                            className={`size-4 shrink-0 mt-0.5 ${
                              t.isPopular ? "text-accent" : "text-brand"
                            }`}
                          />
                          <span className={t.isPopular ? "text-white/90" : "text-muted"}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ButtonLink
                    href={`#consultation`}
                    variant={t.isPopular ? "secondary" : "primary"}
                    className="w-full mt-auto"
                  >
                    <span>{isUz ? "Ushbu paketni tanlash" : "Выбрать этот пакет"}</span>
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. MARKETING & IT TARIFFS (TZ 8.2 & 8.3) */}
      <section className="bg-surface py-14 sm:py-20 border-y border-line">
        <Container className="space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
              {isUz ? "TZ 8.2 & 8.3-bandlar" : "Пункты 8.2 и 8.3 ТЗ"}
            </span>
            <h2 className="text-heading font-black tracking-tight text-ink">
              {isUz ? "Marketing va IT xizmatlari tariflari" : "Маркетинг и разработка IT"}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Marketing Card (TZ 8.2) */}
            {marketingTariffs.map((t) => {
              let features: string[] = [];
              try {
                features = JSON.parse(isUz ? t.featuresUz : t.featuresRu);
              } catch {
                features = [];
              }

              return (
                <div
                  key={t.id}
                  className="p-8 sm:p-10 rounded-panel bg-paper border border-line shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand/10 text-brand">
                        TZ 8.2 &bull; Marketing
                      </span>
                      <span className="text-xs text-muted font-medium">
                        {isUz ? "Individual hisoblanadi" : "Индивидуальный расчет"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-ink mb-2">
                      {isUz ? t.nameUz : t.nameRu}
                    </h3>
                    <p className="text-xs text-muted mb-6">
                      {isUz
                        ? "Loyiha hajmiga va maqsadlariga qarab individual hisoblanadi."
                        : "Рассчитывается индивидуально в зависимости от масштаба и задач бизнеса."}
                    </p>

                    <div className="my-6 p-4 rounded-card bg-surface border border-line flex items-baseline gap-2">
                      <span className="text-xs font-bold text-muted uppercase">
                        {isUz ? "Boshlang'ich narx:" : "Начальная цена:"}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-ink">{t.price}</span>
                    </div>

                    <ul className="space-y-3 pt-2 text-xs mb-8">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="size-4 text-brand shrink-0 mt-0.5" />
                          <span className="text-ink font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ButtonLink href="#consultation" className="w-full sm:w-auto">
                    <span>{isUz ? "Marketing rejasi olish" : "Получить план маркетинга"}</span>
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              );
            })}

            {/* IT Services Card (TZ 8.3) */}
            {itTariffs.map((t) => {
              let features: string[] = [];
              try {
                features = JSON.parse(isUz ? t.featuresUz : t.featuresRu);
              } catch {
                features = [];
              }

              return (
                <div
                  key={t.id}
                  className="p-8 sm:p-10 rounded-panel bg-paper border border-line shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/20 text-ink border border-accent/40 font-semibold">
                        TZ 8.3 &bull; IT Yechimlar
                      </span>
                      <span className="text-xs text-muted font-medium">
                        {isUz ? "Individual buyurtma" : "Индивидуальный заказ"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-ink mb-2">
                      {isUz ? t.nameUz : t.nameRu}
                    </h3>
                    <p className="text-xs text-muted mb-6">
                      {isUz
                        ? "Har bir loyiha individual buyurtma asosida kelishiladi va bepul smeta taqdim etiladi."
                        : "Каждый проект согласовывается индивидуально на основе технического задания."}
                    </p>

                    <div className="my-6 p-4 rounded-card bg-surface border border-line flex items-baseline gap-2">
                      <span className="text-xs font-bold text-muted uppercase">
                        {isUz ? "Narxlash tartibi:" : "Формат расчета:"}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-brand">
                        {isUz ? "Individual Smeta" : "Индивидуальная смета"}
                      </span>
                    </div>

                    <ul className="space-y-3 pt-2 text-xs mb-8">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="size-4 text-brand shrink-0 mt-0.5" />
                          <span className="text-ink font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ButtonLink href="#consultation" variant="secondary" className="w-full sm:w-auto shadow-md">
                    <span>{isUz ? "Bepul smeta / taklif olish" : "Получить бесплатную смету"}</span>
                    <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. APPLICATION / CONSULTATION FORM (TZ 8.3 & 9.1) */}
      <section id="consultation" className="scroll-mt-8 py-16 bg-paper">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              <span>{isUz ? "TZ 9.1 &bull; Buyurtma Formasi" : "Пункт 9.1 ТЗ &bull; Заказ"}</span>
            </div>

            <h2 className="text-heading font-black tracking-tight text-ink">
              {isUz
                ? "Bepul smeta va konsultatsiya olish"
                : "Получить бесплатную смету и консультацию"}
            </h2>

            <p className="mt-4 text-muted text-sm leading-relaxed mb-8">
              {isUz
                ? "Quyidagi formani to'ldiring. Mutaxassisimiz siz tanlagan tarif bo'yicha shartlarni tushuntirib beradi va smeta hisoblab beradi."
                : "Заполните заявку, и мы бесплатно рассчитаем смету вашего проекта, подберем оптимальный тариф и свяжемся с вами."}
            </p>

            <div className="p-6 rounded-card bg-surface border border-line space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <HelpCircle className="size-4 text-brand" />
                <span>{isUz ? "Tarif tanlashda yordam kerakmi?" : "Нужна помощь с выбором тарифа?"}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {isUz
                  ? "Biznesingiz uchun aynan qaysi paket ko'proq mos kelishini bilmasangiz, telefon yoki Telegram orqali mutaxassisimizdan bepul maslahat oling:"
                  : "Свяжитесь с нами, и наш ведущий маркетолог подскажет, какой формат продвижения принесет максимальную прибыль:"}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a href={site.phoneHref} className="text-xs font-bold text-brand hover:underline flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {site.phone}
                </a>
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-telegram hover:underline flex items-center gap-1.5"
                >
                  <Send className="size-3.5" />
                  {site.telegramLabel}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-panel border border-line bg-surface p-6 sm:p-10 shadow-card">
            <h3 className="text-lg font-bold text-ink mb-1">
              {isUz ? "Buyurtma so'rovi" : "Заявка на тариф"}
            </h3>
            <p className="text-xs text-muted mb-6">
              {isUz
                ? "Tanlagan tarifingiz bo'yicha ma'lumotlarni qoldiring:"
                : "Укажите ваши данные для связи:"}
            </p>
            <ConsultationForm
              key={locale}
              labels={{
                name: isUz ? "Ismingiz" : "Ваше имя",
                phone: isUz ? "Telefon raqamingiz" : "Номер телефона",
                service: isUz ? "Tanlangan tarif / xizmat" : "Выбранный тариф / услуга",
                message: isUz ? "Loyiha haqida izoh" : "Комментарий к заказу",
                choose: isUz ? "Tarifni tanlang" : "Выберите тариф",
                submit: isUz ? "Arizani yuborish" : "Отправить заявку",
                notice: isUz ? "Ma'lumotlaringiz maxfiy saqlanadi." : "Данные строго конфиденциальны.",
                required: isUz ? "Telefon raqamingizni kiriting." : "Укажите номер телефона.",
                checked: isUz ? "So'rovingiz qabul qilindi!" : "Заявка успешно принята!",
              }}
              services={dbTariffs.map((t) => ({
                value: isUz ? t.nameUz : t.nameRu,
                label: `${isUz ? t.nameUz : t.nameRu} (${t.price})`,
              }))}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
