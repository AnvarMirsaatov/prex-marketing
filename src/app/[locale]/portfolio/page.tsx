import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { getLocale } from "@/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";
  const title = isUz ? "Portfolio va Keyslar — Prox Marketing" : "Портфолио и Кейсы — Prox Marketing";
  const description = isUz
    ? "Prox Marketing Agency muvaffaqiyatli keyslari va amalga oshirilgan loyihalari."
    : "Успешные кейсы и реализованные проекты Prox Marketing Agency.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/portfolio`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/portfolio`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <PortfolioPage locale={locale} />;
}
