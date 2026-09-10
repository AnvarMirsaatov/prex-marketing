import { ButtonLink } from "@/components/ui/button";
import { site } from "@/config/site";
export function TelegramChat({ label }: { label: string }) {
  return (
    <ButtonLink
      href={site.telegram}
      variant="telegram"
      aria-label={label}
      className="fixed bottom-4 right-4 z-30 size-14 rounded-full p-0 shadow-raised sm:bottom-6 sm:right-6"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
        <path
          d="m3 10 18-7-5 18-5-7-8-4Zm8 4L21 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </ButtonLink>
  );
}
