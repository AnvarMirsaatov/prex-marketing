import { ContactPage } from "@/components/contact/contact-page";
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
    ? "Aloqa va Bog'lanish — Prox Marketing Agency"
    : "Контакты и Связь — Prox Marketing Agency";
  const description = isUz
    ? "Telefon: +998 20 026 04 18, Telegram: @manager_prox, Instagram: @prox_uz. Bepul konsultatsiya va loyiha tahlili."
    : "Телефон: +998 20 026 04 18, Telegram: @manager_prox, Instagram: @prox_uz. Бесплатная консультация и анализ проекта.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proxmarketing.uz/${locale}/aloqa`,
    },
    openGraph: {
      title,
      description,
      url: `https://proxmarketing.uz/${locale}/aloqa`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await getLocale(params);
  return <ContactPage locale={locale} />;
}
