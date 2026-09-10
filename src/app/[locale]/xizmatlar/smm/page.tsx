import { ServiceDetailPage } from "@/components/services/service-detail-page";
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
    ? "SMM Xizmatlari — Prox Marketing Agency"
    : "SMM Услуги — Prox Marketing Agency";
  const description = isUz
    ? "Strategik SMM, professional kontent, Instagram va Facebook target reklama hamda tahlil."
    : "Стратегический SMM, контент-продакшн, таргетированная реклама и аналитика.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/xizmatlar/smm`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/xizmatlar/smm`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <ServiceDetailPage locale={locale} slug="smm" />;
}
