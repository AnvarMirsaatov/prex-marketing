import type { Locale } from "@/i18n/config";

export const routePaths = {
  home: "",
  about: "/biz-haqimizda",
  services: "/xizmatlar",
  smm: "/xizmatlar/smm",
  marketing: "/xizmatlar/marketing",
  it: "/xizmatlar/it",
  pricing: "/tariflar",
  partners: "/hamkorlar",
  portfolio: "/portfolio",
  contact: "/aloqa",
} as const;

export type PageKey = keyof typeof routePaths;
export const navigationKeys = [
  "home",
  "about",
  "services",
  "pricing",
  "partners",
  "contact",
] as const satisfies readonly PageKey[];
export const serviceKeys = ["smm", "marketing", "it"] as const satisfies readonly PageKey[];

export function localizedPath(locale: Locale, page: PageKey) {
  return `/${locale}${routePaths[page]}`;
}
