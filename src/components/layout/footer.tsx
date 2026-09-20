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
    <footer className="border-t border-blue-500/15 bg-[#030712] text-slate-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="grid gap-10 pb-16 pt-16 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        <div className="space-y-6">
          <div>
            <span className="text-2xl font-black tracking-tight text-white">
              {site.wordmark}
              <span className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">.</span>
            </span>
            <span className="block text-xs font-semibold tracking-widest text-slate-400 mt-0.5 uppercase">
              {site.wordmarkDescriptor}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {locale === "uz"
              ? "Bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi."
              : "Digital-агентство системного маркетинга и роста продаж для амбициозных брендов."}
          </p>
          <LanguageSwitcher locale={locale} label={messages.languageLabel} />
        </div>

        <address
          aria-label={messages.contactsLabel}
          className="flex flex-col items-start gap-3.5 not-italic text-sm text-slate-300"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
            {messages.contactsLabel}
          </span>
          <a
            className="font-bold text-white hover:text-sky-400 transition-colors inline-flex items-center gap-2"
            href={site.phoneHref}
          >
            <span>{site.phone}</span>
          </a>
          <a
            className="hover:text-sky-400 text-slate-300 transition-colors inline-flex items-center gap-2"
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <span>Instagram · {site.instagramLabel}</span>
          </a>
          <a
            className="hover:text-sky-400 text-slate-300 transition-colors inline-flex items-center gap-2"
            href={site.telegram}
            target="_blank"
            rel="noreferrer"
          >
            <span>Telegram · {site.telegramLabel}</span>
          </a>
        </address>

        <nav aria-label={messages.navigationLabel} className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1 block">
            {messages.navigationLabel}
          </span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {navigationKeys.map((page) => (
              <Link
                key={page}
                href={localizedPath(locale, page)}
                className="py-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {messages.pages[page]}
              </Link>
            ))}
          </div>
        </nav>
      </Container>

      <div className="border-t border-blue-500/10 py-6 text-center text-[11px] text-slate-500">
        <Container>
          <p>© {new Date().getFullYear()} {site.name}. Barcha huquqlar himoyalangan.</p>
        </Container>
      </div>
    </footer>
  );
}
