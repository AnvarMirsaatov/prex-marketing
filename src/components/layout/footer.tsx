import Link from "next/link";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { localizedPath, navigationKeys } from "@/config/routes";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export function Footer({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 pb-24 pt-12 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-5">
          <p className="text-xl font-bold">{site.name}</p>
          <LanguageSwitcher locale={locale} label={messages.languageLabel} />
        </div>
        <address
          aria-label={messages.contactsLabel}
          className="flex flex-col items-start gap-4 not-italic"
        >
          <a className="font-bold hover:text-brand" href={site.phoneHref}>
            {site.phone}
          </a>
          <a className="hover:text-brand" href={site.instagram}>
            Instagram · {site.instagramLabel}
          </a>
          <a className="hover:text-brand" href={site.telegram}>
            Telegram · {site.telegramLabel}
          </a>
        </address>
        <nav aria-label={messages.navigationLabel} className="grid grid-cols-2 gap-x-5 gap-y-1">
          {navigationKeys.map((page) => (
            <Link
              key={page}
              href={localizedPath(locale, page)}
              className="py-2 text-label hover:text-brand"
            >
              {messages.pages[page]}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
