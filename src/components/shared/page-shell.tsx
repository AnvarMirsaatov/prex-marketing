import Link from "next/link";
import { HomePage } from "@/components/home/home-page";
import { Container } from "@/components/layout/container";
import { localizedPath, serviceKeys, type PageKey } from "@/config/routes";
import { getLocale } from "@/i18n/get-locale";
import { getMessages } from "@/i18n/messages";

export async function PageShell({
  params,
  page,
}: {
  params: Promise<{ locale: string }>;
  page: PageKey;
}) {
  const locale = await getLocale(params);
  const messages = getMessages(locale);
  if (page === "home") return <HomePage locale={locale} />;
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{messages.pages[page]}</h1>
      {page === "services" && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {serviceKeys.map((service) => (
            <li key={service}>
              <Link
                href={localizedPath(locale, service)}
                className="block rounded border border-neutral-200 p-5 hover:bg-neutral-50"
              >
                {messages.pages[service]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
