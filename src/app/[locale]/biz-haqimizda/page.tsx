import { AboutPage } from "@/components/about/about-page";
import { getLocale } from "@/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";
  const title = isUz ? "Biz haqimizda — Prox Marketing" : "О нас — Prox Marketing";
  const description = isUz
    ? "Prox — bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi."
    : "Prox — digital-маркетинговое агентство, специализирующееся на системном развитии бизнеса в цифровой среде.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/biz-haqimizda`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/biz-haqimizda`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <AboutPage locale={locale} />;
}
