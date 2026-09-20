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
      className="flex items-center gap-1 rounded-control border border-blue-500/20 bg-[#0a1324]/80 backdrop-blur-md p-1 shadow-xs shrink-0"
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
            className={`rounded-md px-2.5 py-1 text-xs font-bold tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.45)] border border-blue-400/30"
                : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {language.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
