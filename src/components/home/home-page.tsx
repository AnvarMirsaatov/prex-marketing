import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { Reveal } from "@/components/ui/reveal";
import { PartnerSlider } from "@/components/home/partner-slider";
import { ConsultationForm } from "@/components/home/consultation-form";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { localizedPath, serviceKeys } from "@/config/routes";
import { site } from "@/config/site";
import { partners, smmPlans, marketingStartingAmount, pricingCurrency } from "@/data/home";
import type { Locale } from "@/i18n/config";
import { getHomeMessages } from "@/i18n/home-messages";
import {
  Compass,
  BarChart3,
  Sparkles,
  Layers,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getHomeMessages(locale);
  const pricingHref = localizedPath(locale, "pricing");

  const money = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: pricingCurrency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);

  const uspIcons = [Compass, BarChart3, Sparkles, Layers];

  return (
    <>
      {/* 1. HERO CAROUSEL (CINEMATIC TRAILER SLIDER) */}
      <HeroCarousel locale={locale} />

      {/* 2. SERVICES PREVIEW SECTION */}
      <section id="services" aria-labelledby="services-title" className="py-section scroll-mt-6 bg-[#050b14]">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
                  {t.hero.eyebrow}
                </p>
                <h2 id="services-title" className="text-heading font-black tracking-tight text-white">
                  {t.services.title}
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">{t.services.subtitle}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {serviceKeys.map((key, index) => (
              <ServiceCard
                key={key}
                index={String(index + 1).padStart(2, "0")}
                title={t.services.items[key].title}
                description={t.services.items[key].description}
                href={localizedPath(locale, key)}
                actionLabel={t.services.action}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 3. "NEGA AYNAN BIZ?" (USP) SECTION */}
      <section aria-labelledby="usp-title" className="bg-[#070e1c] py-section border-y border-blue-500/15 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
                USP &bull; Afzalliklarimiz
              </span>
              <h2 id="usp-title" className="text-heading font-black tracking-tight text-white">
                {t.usp.title}
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">{t.usp.subtitle}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.usp.items.map((item, i) => {
              const Icon = uspIcons[i % uspIcons.length];
              return (
                <div
                  key={i}
                  className="interactive-card relative p-6 rounded-card border border-blue-500/15 bg-[#0a1326]/75 backdrop-blur-md flex flex-col justify-between group overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 size-28 rounded-full bg-blue-500/10 blur-xl group-hover:bg-sky-400/20 transition-all duration-300 pointer-events-none" />

                  <div>
                    <div className="size-12 rounded-xl bg-blue-500/15 border border-blue-500/25 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2.5 group-hover:text-sky-200 transition-colors">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-blue-500/15 flex items-center gap-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                    <CheckCircle2 className="size-3.5 text-sky-400" />
                    <span>Prox kafolati</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. PARTNERS SLIDER */}
      <section aria-labelledby="partners-title" className="py-section bg-[#050b14]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
                Portfolio & Hamkorlar
              </p>
              <h2 id="partners-title" className="text-heading font-black tracking-tight text-white">
                {t.partners.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{t.partners.subtitle}</p>
          </div>

          <PartnerSlider
            items={partners}
            placeholder={t.partners.placeholder}
            previous={t.partners.previous}
            next={t.partners.next}
            label={t.partners.listLabel}
          />
        </Container>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section id="pricing" aria-labelledby="pricing-title" className="bg-[#070e1c] py-section scroll-mt-6 border-y border-blue-500/15 relative overflow-hidden">
        <div className="absolute -top-24 left-1/3 size-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
                  Shaffof narxlar
                </p>
                <h2 id="pricing-title" className="text-heading font-black tracking-tight text-white">
                  {t.pricing.title}
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">{t.pricing.subtitle}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* SMM Tariffs Card */}
            <article className="interactive-card flex flex-col rounded-card border border-blue-500/20 bg-[#0a1326]/80 backdrop-blur-md p-6 sm:p-8 relative group overflow-hidden">
              <div className="absolute -top-12 -right-12 size-36 rounded-full bg-blue-600/15 blur-2xl pointer-events-none group-hover:bg-sky-400/25 transition-all" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{t.pricing.smm}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-sky-400">
                  4 ta paket
                </span>
              </div>
              <dl className="mb-8 space-y-4">
                {smmPlans.map((plan) => (
                  <div
                    key={plan.months}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-blue-500/15 pb-3"
                  >
                    <dt className="text-xs font-medium text-slate-400">
                      {t.pricing.monthPlan.replace("{months}", String(plan.months))}
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1">
                      <strong className="text-xl font-black text-white">
                        {money(plan.monthlyAmount)}
                      </strong>
                      <span className="text-xs text-slate-400">{t.pricing.perMonth}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <ButtonLink href={pricingHref} variant="outline" className="mt-auto border-blue-500/25 hover:border-sky-400/50 hover:bg-blue-500/15 text-slate-200 hover:text-white">
                {t.pricing.details}
              </ButtonLink>
            </article>

            {/* Marketing Starting Card */}
            <PricingCard
              title={t.pricing.marketing}
              price={t.pricing.starting.replace("{price}", money(marketingStartingAmount))}
              description={t.pricing.marketingNote}
              href={pricingHref}
              actionLabel={t.pricing.details}
            />

            {/* IT Custom Estimate Card */}
            <PricingCard
              title={t.pricing.it}
              price={t.pricing.individual}
              description={t.pricing.itNote}
              href="#consultation"
              actionLabel={t.pricing.estimate}
            />
          </div>
        </Container>
      </section>

      {/* 6. FREE CONSULTATION / CTA FORM */}
      <section
        id="consultation"
        aria-labelledby="consultation-title"
        className="scroll-mt-6 py-section bg-[#050b14] border-t border-blue-500/15 relative overflow-hidden"
      >
        <div className="absolute bottom-0 right-1/4 size-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              <span>Birinchi qadam</span>
            </div>

            <h2 id="consultation-title" className="text-heading font-black tracking-tight text-balance text-white">
              {t.consultation.title}
            </h2>

            <p className="mt-4 text-slate-300 text-base leading-relaxed mb-8">
              {t.consultation.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-blue-500/15">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-500/15 bg-[#0a1326]/60 backdrop-blur-sm">
                <div className="size-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-sky-400 flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">To'g'ridan-to'g'ri qo'ng'iroq:</span>
                  <a href={site.phoneHref} className="text-lg font-bold text-white hover:text-sky-400 transition-colors">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-500/15 bg-[#0a1326]/60 backdrop-blur-sm">
                <div className="size-10 rounded-xl bg-sky-500/15 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                  <Send className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Telegram orqali tezkor aloqa:</span>
                  <a
                    href={site.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-sky-400 hover:underline"
                  >
                    {site.telegramLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ButtonLink href={site.telegram} variant="telegram">
                {t.consultation.direct}
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-panel border border-blue-500/20 bg-[#0a1326]/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(2,6,23,0.9),inset_0_1px_1px_rgba(255,255,255,0.06)] relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-1">So'rov yuborish</h3>
            <p className="text-xs text-slate-400 mb-6">
              Quyidagi formani to'ldiring, 15 daqiqa ichida bog'lanamiz:
            </p>
            <ConsultationForm
              key={locale}
              labels={t.consultation.fields}
              services={serviceKeys.map((key) => ({
                value: t.services.items[key].title,
                label: t.services.items[key].title,
              }))}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
