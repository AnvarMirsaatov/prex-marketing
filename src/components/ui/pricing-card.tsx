import { ButtonLink } from "@/components/ui/button";
export function PricingCard({
  title,
  price,
  period,
  description,
  actionLabel,
  href,
}: {
  title: string;
  price: string;
  period?: string;
  description?: string;
  actionLabel: string;
  href: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-surface p-6 sm:p-8">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="my-6 flex flex-wrap items-baseline gap-2">
        <strong className="text-heading">{price}</strong>
        {period && <span className="text-muted">{period}</span>}
      </p>
      {description && <p className="mb-6 text-muted">{description}</p>}
      <ButtonLink href={href} className="mt-auto">
        {actionLabel}
      </ButtonLink>
    </article>
  );
}
