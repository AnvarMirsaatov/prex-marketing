import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { TelegramChat } from "@/components/layout/telegram-chat";
import { Footer } from "@/components/layout/footer";
import { locales } from "@/i18n/config";
import { getLocale } from "@/i18n/get-locale";
import { getMessages } from "@/i18n/messages";
import { site } from "@/config/site";
import { ToastProvider } from "@/components/providers/toast-provider";
import "@/app/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await getLocale(params);
  const isUz = locale === "uz";

  const title = isUz
    ? "Prox Marketing Agency — Biznesingizni yangi bosqichga olib chiqamiz"
    : "Prox Marketing Agency — Digital-агентство системного маркетинга и продаж";

  const description = isUz
    ? "Bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi. Strategik SMM, target reklama, veb-saytlar va avtomatlashtirish."
    : "Digital-маркетинговое агентство в Ташкенте. Системное развитие бизнеса, таргетированная реклама, стратегический SMM, разработка сайтов и рост продаж.";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description,
    keywords: isUz
      ? [
          "Prox Marketing",
          "Digital marketing agentligi",
          "SMM xizmatlari Toshkent",
          "Target reklama",
          "Marketing strategiya",
          "Veb-sayt yaratish",
          "Instagram target",
          "Telegram botlar",
          "Branding",
        ]
      : [
          "Prox Marketing",
          "Диджитал маркетинг Ташкент",
          "SMM агентство",
          "Таргетированная реклама",
          "Маркетинговая стратегия",
          "Создание сайтов",
          "Продвижение в Instagram",
          "Разработка ботов",
        ],
    authors: [{ name: "Prox Marketing Agency", url: site.url }],
    creator: "Prox Marketing Agency",
    publisher: "Prox Marketing Agency",
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: `${site.url}/${locale}`,
      languages: {
        uz: `${site.url}/uz`,
        ru: `${site.url}/ru`,
        "x-default": `${site.url}/uz`,
      },
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
          alt: "Prox Marketing Agency",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocale(params);
  const messages = getMessages(locale);
  return (
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col">
        <ToastProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4"
          >
            {messages.skipToContent}
          </a>
          <Header locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} />
          <TelegramChat label={messages.design.telegramChat} />
        </ToastProvider>
      </body>
    </html>
  );
}
