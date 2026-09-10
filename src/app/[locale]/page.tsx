import { PageShell } from "@/components/shared/page-shell";
import { getLocale } from "@/i18n/get-locale";
import { site } from "@/config/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";

  const title = isUz
    ? "Prox Marketing Agency — Biznesingizni yangi bosqichga olib chiqamiz"
    : "Prox Marketing Agency — Выводим ваш бизнес на новый уровень";

  const description = isUz
    ? "Bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi. Strategik SMM, target reklama va IT yechimlar."
    : "Digital-агентство полного цикла: стратегический SMM, контекстная и таргетированная реклама, IT-разработка и аудит продаж.";

  return {
    title,
    description,
    alternates: {
      canonical: `${site.url}/${locale}`,
    },
    openGraph: {
      title,
      description,
      url: `${site.url}/${locale}`,
      siteName: site.name,
      locale: isUz ? "uz_UZ" : "ru_RU",
      type: "website",
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <PageShell params={params} page="home" />;
}

