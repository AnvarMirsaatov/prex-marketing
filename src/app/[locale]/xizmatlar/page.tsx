import { ServicesPage } from "@/components/services/services-page";
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
    ? "Xizmatlarimiz — Prox Marketing Agency"
    : "Наши Услуги — Prox Marketing Agency";
  const description = isUz
    ? "Prox Marketing Agency xizmatlari: SMM, Kompleks Marketing va IT xizmatlari."
    : "Услуги Prox Marketing Agency: SMM, Комплексный маркетинг и IT-решения.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/xizmatlar`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/xizmatlar`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <ServicesPage locale={locale} />;
}
