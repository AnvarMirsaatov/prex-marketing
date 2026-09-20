import { ButtonLink } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
export function CTASection({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string;
  description?: string;
  actionLabel: string;
  href: string;
}) {
  return (
    <section className="relative overflow-hidden flex flex-col items-start gap-8 rounded-3xl bg-gradient-to-r from-[#0d1b38] via-[#0f224a] to-[#0a152e] border border-blue-500/25 p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] lg:flex-row lg:items-center lg:justify-between">
      <div className="absolute -right-16 -top-16 size-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
      <div className="relative z-10">
        <SectionTitle title={title} description={description} />
      </div>
      <div className="relative z-10 shrink-0">
        <ButtonLink href={href} variant="primary">
          {actionLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
