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
    ? "IT Xizmatlari va Yechimlar — Prox Marketing Agency"
    : "IT Услуги и Решения — Prox Marketing Agency";
  const description = isUz
    ? "Veb-saytlar, mobil ilovalar, to'lov integratsiyalari va sun'iy intellekt botlari ishlab chiqish."
    : "Разработка сайтов, мобильных приложений, интеграция платежей и AI-ботов.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/xizmatlar/it`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/xizmatlar/it`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <ServiceDetailPage locale={locale} slug="it" />;
}
