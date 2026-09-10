"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const suffix = pathname.split("/").slice(2).join("/");

  return (
    <nav
      aria-label={label}
      className="flex items-center gap-1 rounded-control border border-line bg-paper p-1 shadow-xs shrink-0"
    >
      {locales.map((language) => {
        const isActive = language === locale;
        return (
          <Link
            key={language}
            href={`/${language}${suffix ? `/${suffix}` : ""}`}
            hrefLang={language}
            lang={language}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-lg px-2.5 py-1 text-xs font-black tracking-wide transition-all ${
              isActive
                ? "bg-brand text-paper shadow-xs"
                : "text-muted hover:text-ink hover:bg-surface"
            }`}
          >
            {language.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
