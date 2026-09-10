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
    <section className="flex flex-col items-start gap-8 rounded-panel bg-ink p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
      <SectionTitle title={title} description={description} inverse />
      <ButtonLink href={href} variant="secondary" className="shrink-0">
        {actionLabel}
      </ButtonLink>
    </section>
  );
}
