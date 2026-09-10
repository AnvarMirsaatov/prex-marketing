import { PartnersPage } from "@/components/partners/partners-page";
import { getLocale } from "@/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";
  const title = isUz ? "Hamkorlarimiz — Prox Marketing" : "Наши партнёры — Prox Marketing";
  const description = isUz
    ? "Prox Marketing Agency mijozlari va ishonch bildirgan hamkor kompaniyalari ro'yxati."
    : "Список партнеров и клиентов Prox Marketing Agency.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/hamkorlar`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/hamkorlar`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <PartnersPage locale={locale} />;
}
