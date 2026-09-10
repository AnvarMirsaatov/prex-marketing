import type { Locale } from "@/i18n/config";
import type { PageKey } from "@/config/routes";
import uz from "@/i18n/messages/uz.json";
import ru from "@/i18n/messages/ru.json";

export interface Messages {
  pages: Record<PageKey, string>;
  design: typeof uz.design;
  navigationLabel: string;
  languageLabel: string;
  skipToContent: string;
  contactsLabel: string;
}

const messages = { uz, ru } satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
