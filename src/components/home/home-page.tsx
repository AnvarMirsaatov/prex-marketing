import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { Reveal } from "@/components/ui/reveal";
import { PartnerSlider } from "@/components/home/partner-slider";
import { ConsultationForm } from "@/components/home/consultation-form";
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
  ArrowRight,
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
      {/* 1. HERO BANNER */}
      <section
        aria-labelledby="hero-title"
        className="relative bg-ink text-paper py-section overflow-hidden border-b border-line/10"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/10 border border-surface/20 text-accent text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-xs">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span>{t.hero.eyebrow}</span>
            </div>

            <h1
              id="hero-title"
              className="text-display font-black tracking-tight leading-[1.08] text-balance mb-6"
            >
              {t.hero.title}
            </h1>

            <p className="text-body text-paper/80 max-w-2xl text-lg leading-relaxed mb-8">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="#consultation" variant="secondary" className="shadow-lg">
                <span>{t.hero.action}</span>
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="#services"
                variant="outline"
                className="bg-transparent text-paper border-paper/30 hover:bg-paper/10"
              >
                {t.hero.secondary}
              </ButtonLink>
            </div>

            {/* Metrics */}
            <div className="mt-14 pt-10 border-t border-paper/15 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="block text-3xl sm:text-4xl font-black text-accent">
                  {t.hero.stat1}
                </span>
                <span className="text-xs sm:text-sm text-paper/70 font-medium">
                  {t.hero.stat1Label}
                </span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-black text-white">
                  {t.hero.stat2}
                </span>
                <span className="text-xs sm:text-sm text-paper/70 font-medium">
                  {t.hero.stat2Label}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-3xl sm:text-4xl font-black text-accent">
                  {t.hero.stat3}
                </span>
                <span className="text-xs sm:text-sm text-paper/70 font-medium">
                  {t.hero.stat3Label}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SERVICES PREVIEW SECTION */}
      <section id="services" aria-labelledby="services-title" className="py-section scroll-mt-6">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">
                  {t.hero.eyebrow}
                </p>
                <h2 id="services-title" className="text-heading font-black tracking-tight">
                  {t.services.title}
                </h2>
              </div>
              <p className="text-sm text-muted max-w-md">{t.services.subtitle}</p>
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
      <section aria-labelledby="usp-title" className="bg-surface py-section border-y border-line/60">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-3">
                USP &bull; Afzalliklarimiz
              </span>
              <h2 id="usp-title" className="text-heading font-black tracking-tight">
                {t.usp.title}
              </h2>
              <p className="mt-3 text-sm text-muted">{t.usp.subtitle}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.usp.items.map((item, i) => {
              const Icon = uspIcons[i % uspIcons.length];
              return (
                <div
                  key={i}
                  className="p-6 rounded-card bg-paper border border-line flex flex-col justify-between interactive-card transition-all"
                >
                  <div>
                    <div className="size-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-5">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-base font-bold text-ink mb-2.5">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted">{item.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center gap-1 text-[11px] font-bold text-brand uppercase tracking-wider">
                    <CheckCircle2 className="size-3.5" />
                    <span>Prox kafolati</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. PARTNERS SLIDER */}
      <section aria-labelledby="partners-title" className="py-section">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">
                Portfolio & Hamkorlar
              </p>
              <h2 id="partners-title" className="text-heading font-black tracking-tight">
                {t.partners.title}
              </h2>
            </div>
            <p className="text-xs text-muted max-w-xs">{t.partners.subtitle}</p>
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
      <section id="pricing" aria-labelledby="pricing-title" className="bg-surface py-section scroll-mt-6">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">
                  Shaffof narxlar
                </p>
                <h2 id="pricing-title" className="text-heading font-black tracking-tight">
                  {t.pricing.title}
                </h2>
              </div>
              <p className="text-sm text-muted max-w-md">{t.pricing.subtitle}</p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* SMM Tariffs Card */}
            <article className="flex flex-col rounded-card border border-line bg-paper p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.pricing.smm}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 text-brand">
                  4 ta paket
                </span>
              </div>
              <dl className="mb-8 space-y-4">
                {smmPlans.map((plan) => (
                  <div
                    key={plan.months}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line pb-3"
                  >
                    <dt className="text-label text-muted">
                      {t.pricing.monthPlan.replace("{months}", String(plan.months))}
                    </dt>
                    <dd className="flex flex-wrap items-baseline gap-x-1">
                      <strong className="text-xl font-black text-ink">
                        {money(plan.monthlyAmount)}
                      </strong>
                      <span className="text-label text-muted">{t.pricing.perMonth}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <ButtonLink href={pricingHref} className="mt-auto">
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
        className="scroll-mt-6 py-section bg-paper border-t border-line"
      >
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              <span>Birinchi qadam</span>
            </div>

            <h2 id="consultation-title" className="text-heading font-black tracking-tight text-balance">
              {t.consultation.title}
            </h2>

            <p className="mt-4 text-muted text-base leading-relaxed mb-8">
              {t.consultation.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-line">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-muted">To'g'ridan-to'g'ri qo'ng'iroq:</span>
                  <a href={site.phoneHref} className="text-lg font-bold text-ink hover:text-brand">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-telegram/10 text-telegram flex items-center justify-center shrink-0">
                  <Send className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-muted">Telegram orqali tezkor aloqa:</span>
                  <a
                    href={site.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-telegram hover:underline"
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

          <div className="rounded-panel border border-line bg-paper p-6 sm:p-10 shadow-card">
            <h3 className="text-lg font-bold text-ink mb-1">So'rov yuborish</h3>
            <p className="text-xs text-muted mb-6">
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
