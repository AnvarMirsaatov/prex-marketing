import { PricingPage } from "@/components/pricing/pricing-page";
import { getLocale } from "@/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";
  const title = isUz
    ? "Tariflar va Narxlar — Prox Marketing Agency"
    : "Тарифы и Цены — Prox Marketing Agency";
  const description = isUz
    ? "SMM, Marketing va IT xizmatlari bo'yicha shaffof tariflar va narxlar jadvali."
    : "Прозрачные тарифы и цены на услуги SMM, маркетинга и IT-разработки.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/tariflar`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/tariflar`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <PricingPage locale={locale} />;
}
