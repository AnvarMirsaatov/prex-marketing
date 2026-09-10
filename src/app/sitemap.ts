import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/biz-haqimizda",
    "/xizmatlar",
    "/xizmatlar/smm",
    "/xizmatlar/marketing",
    "/xizmatlar/it",
    "/tariflar",
    "/hamkorlar",
    "/portfolio",
    "/aloqa",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const isHome = route === "";
      sitemapEntries.push({
        url: `${site.url}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: isHome ? "daily" : "weekly",
        priority: isHome ? 1.0 : route.startsWith("/xizmatlar") || route === "/tariflar" ? 0.9 : 0.8,
        alternates: {
          languages: {
            uz: `${site.url}/uz${route}`,
            ru: `${site.url}/ru${route}`,
            "x-default": `${site.url}/uz${route}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
