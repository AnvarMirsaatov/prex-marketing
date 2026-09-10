import { Container } from "@/components/layout/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { ServiceCard } from "@/components/ui/service-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { PartnerLogo } from "@/components/ui/partner-logo";
import { Reveal } from "@/components/ui/reveal";
import { CTASection } from "@/components/sections/cta-section";
import { FormPreview } from "@/components/preview/form-preview";
import { localizedPath } from "@/config/routes";
import { site } from "@/config/site";
import { previewPricing } from "@/config/preview";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export function DesignShowcase({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.design;
  const contact = localizedPath(locale, "contact");
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: previewPricing.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(previewPricing.amount);
  return (
    <>
      <section className="bg-surface py-section">
        <Container>
          <SectionTitle as="h1" eyebrow={t.eyebrow} title={t.title} description={t.intro} />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={contact}>{t.primary}</ButtonLink>
            <ButtonLink variant="secondary" href={localizedPath(locale, "services")}>
              {t.secondary}
            </ButtonLink>
          </div>
        </Container>
      </section>
      <Container className="space-y-section py-section">
        <section className="space-y-6">
          <SectionTitle title={t.tokens} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: t.brand, style: "bg-brand text-paper" },
              { label: t.accent, style: "bg-accent text-ink" },
              { label: t.ink, style: "bg-ink text-paper" },
              { label: t.surface, style: "bg-surface text-ink" },
            ].map((color) => (
              <div
                key={color.label}
                className={`flex min-h-28 items-end rounded-card border border-line p-5 text-label font-bold ${color.style}`}
              >
                {color.label}
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <SectionTitle title={t.buttons} />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={contact}>{t.primary}</ButtonLink>
            <ButtonLink variant="secondary" href={localizedPath(locale, "services")}>
              {t.secondary}
            </ButtonLink>
            <ButtonLink variant="outline" href={localizedPath(locale, "about")}>
              {t.outline}
            </ButtonLink>
            <ButtonLink variant="telegram" href={site.telegram}>
              {t.telegram}
            </ButtonLink>
            <Button disabled>{t.disabled}</Button>
          </div>
        </section>
        <Reveal>
          <section className="space-y-6">
            <SectionTitle title={t.services} />
            <div className="grid gap-6 lg:grid-cols-2">
              <ServiceCard
                index="01"
                title={t.serviceTitle}
                description={t.serviceDescription}
                href={contact}
                actionLabel={t.primary}
              />
              <div className="rounded-card bg-accent p-6 sm:p-8">
                <SectionTitle title={t.pricing} />
                <div className="mt-6">
                  <PricingCard
                    title={t.plan}
                    price={price}
                    period={t.period}
                    href={contact}
                    actionLabel={t.primary}
                  />
                </div>
              </div>
            </div>
          </section>
        </Reveal>
        <Reveal>
          <section className="space-y-6">
            <SectionTitle title={t.partners} />
            <div className="max-w-sm">
              <PartnerLogo alt={t.partnerPlaceholder} placeholder={t.partnerPlaceholder} />
            </div>
          </section>
        </Reveal>
        <Reveal>
          <CTASection title={t.ctaTitle} actionLabel={t.telegram} href={site.telegram} />
        </Reveal>
        <Reveal>
          <section className="space-y-6">
            <SectionTitle title={t.fields} />
            <div className="max-w-3xl rounded-card border border-line p-5 sm:p-8">
              <FormPreview messages={messages} />
            </div>
          </section>
        </Reveal>
      </Container>
    </>
  );
}
