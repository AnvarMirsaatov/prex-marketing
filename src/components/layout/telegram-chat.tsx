import { site } from "@/config/site";

export function TelegramChat({ label }: { label: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 group">
      {/* Gentle sapphire pulse aura */}
      <span className="absolute -inset-1 rounded-full bg-sky-400/20 blur-sm animate-pulse pointer-events-none" />
      <a
        href={site.telegram}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-[0_0_25px_rgba(2,132,199,0.5)] border border-sky-300/40 hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6 text-white translate-x-[-1px] translate-y-[1px]">
          <path
            d="m3 10 18-7-5 18-5-7-8-4Zm8 4L21 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}
