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
        className={mobile ? "grid gap-1" : "flex flex-wrap items-center gap-1"}
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
              className={`rounded-control px-3 py-3 text-label font-semibold transition-colors hover:bg-surface ${active ? "text-brand" : "text-ink"}`}
            >
              {messages.pages[page]}
            </Link>
          );
        })}
      </nav>
    );
  }
  return (
    <header ref={root} className="relative z-40 border-b border-line bg-paper">
      <Container>
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
          <Link
            href={localizedPath(locale, "home")}
            className="text-lg font-black leading-tight tracking-tight"
            aria-label={site.name}
          >
            {site.wordmark}
            <span className="text-brand">.</span>
            <span className="block text-xs font-semibold tracking-widest">
              {site.wordmarkDescriptor}
            </span>
          </Link>
          <div className="hidden xl:block">{navigation()}</div>
          <div className="flex items-center gap-2.5">
            <a
              href={site.phoneHref}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-bold text-ink hover:text-brand hover:bg-surface transition-colors"
            >
              <Phone className="size-3.5 text-brand" />
              <span>{site.phone}</span>
            </a>
            <LanguageSwitcher locale={locale} label={messages.languageLabel} />
            <Link
              href="#consultation"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-control bg-brand text-paper text-label font-bold hover:bg-brand-hover transition-colors shadow-xs"
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
              className="flex size-12 items-center justify-center rounded-control border border-line xl:hidden"
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
        <div id="mobile-navigation" hidden={!open} className="border-t border-line py-3 xl:hidden space-y-3">
          {navigation(true)}
          <div className="pt-2 border-t border-line/60 space-y-2">
            <a
              href={site.phoneHref}
              className="flex w-full items-center justify-center gap-2 py-2.5 rounded-control border border-line text-ink text-xs font-bold hover:text-brand transition-colors"
            >
              <Phone className="size-3.5 text-brand" />
              <span>{site.phone}</span>
            </a>
            <Link
              href="#consultation"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center py-3 rounded-control bg-brand text-paper text-sm font-bold hover:bg-brand-hover transition-colors shadow-xs"
            >
              {locale === "uz" ? "Bepul konsultatsiya" : "Бесплатная консультация"}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
