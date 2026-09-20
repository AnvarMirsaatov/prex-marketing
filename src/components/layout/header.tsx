"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { localizedPath, navigationKeys } from "@/config/routes";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { Phone } from "lucide-react";

export function Header({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  function navigation(mobile = false) {
    return (
      <nav
        aria-label={messages.navigationLabel}
        className={mobile ? "grid gap-1.5" : "flex flex-wrap items-center gap-1.5"}
      >
        {navigationKeys.map((page) => {
          const href = localizedPath(locale, page);
          const active =
            pathname === href || (page === "services" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={page}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`rounded-control px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                active
                  ? "text-sky-400 bg-blue-500/10 border border-blue-500/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              {messages.pages[page]}
            </Link>
          );
        })}
      </nav>
    );
  }
  return (
    <header ref={root} className="sticky top-0 z-50 border-b border-blue-500/15 bg-[#050b14]/80 backdrop-blur-xl transition-all duration-300">
      <Container>
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
          <Link
            href={localizedPath(locale, "home")}
            className="group flex flex-col leading-tight tracking-tight focus-visible:outline-none"
            aria-label={site.name}
          >
            <span className="text-xl font-black tracking-tight text-white group-hover:text-slate-100 transition-colors">
              {site.wordmark}
              <span className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">.</span>
            </span>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              {site.wordmarkDescriptor}
            </span>
          </Link>
          <div className="hidden xl:block">{navigation()}</div>
          <div className="flex items-center gap-2.5">
            <a
              href={site.phoneHref}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-control text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] border border-blue-500/15 hover:border-blue-500/30 transition-all duration-200"
            >
              <Phone className="size-3.5 text-sky-400" />
              <span>{site.phone}</span>
            </a>
            <LanguageSwitcher locale={locale} label={messages.languageLabel} />
            <Link
              href="#consultation"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-control bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.5)] border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {locale === "uz" ? "Bepul konsultatsiya" : "Бесплатная консультация"}
            </Link>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? messages.design.closeMenu : messages.design.openMenu}
              onClick={() => setOpen(!open)}
              className="flex size-11 items-center justify-center rounded-control border border-blue-500/20 bg-blue-500/10 text-white hover:bg-blue-500/20 transition-colors xl:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        <div id="mobile-navigation" hidden={!open} className="border-t border-blue-500/20 bg-[#07101f]/95 backdrop-blur-2xl p-4 rounded-b-2xl xl:hidden space-y-4 shadow-2xl">
          {navigation(true)}
          <div className="pt-3 border-t border-blue-500/15 space-y-2.5">
            <a
              href={site.phoneHref}
              className="flex w-full items-center justify-center gap-2 py-2.5 rounded-control border border-blue-500/20 bg-blue-500/5 text-slate-200 text-xs font-bold hover:text-white hover:bg-blue-500/15 transition-colors"
            >
              <Phone className="size-3.5 text-sky-400" />
              <span>{site.phone}</span>
            </a>
            <Link
              href="#consultation"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center py-3 rounded-control bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30 transition-all"
            >
              {locale === "uz" ? "Bepul konsultatsiya" : "Бесплатная консультация"}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
