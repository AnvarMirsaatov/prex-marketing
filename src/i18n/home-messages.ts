import type { Locale } from "@/i18n/config";
import uz from "@/i18n/messages/home-uz.json";
import ru from "@/i18n/messages/home-ru.json";

export type HomeMessages = typeof uz;
const messages = { uz, ru } satisfies Record<Locale, HomeMessages>;
export function getHomeMessages(locale: Locale): HomeMessages {
  return messages[locale];
}
