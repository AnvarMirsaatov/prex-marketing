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
    ? "Marketing Xizmatlari — Prox Marketing Agency"
    : "Маркетинговые Услуги — Prox Marketing Agency";
  const description = isUz
    ? "Kompleks marketing, target va kontekst reklama, brending hamda sotuv bo'limi nazorati."
    : "Комплексный маркетинг, контекстная реклама, брендинг и масштабирование продаж.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/xizmatlar/marketing`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/xizmatlar/marketing`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <ServiceDetailPage locale={locale} slug="marketing" />;
}
