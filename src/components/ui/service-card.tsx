import { ButtonLink } from "@/components/ui/button";
export function ServiceCard({
  title,
  description,
  href,
  actionLabel,
  index,
}: {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  index?: string;
}) {
  return (
    <article className="interactive-card flex h-full flex-col rounded-card border border-line bg-paper p-6 shadow-card transition-[transform,box-shadow] sm:p-8">
      {index && (
        <span aria-hidden="true" className="mb-8 text-label font-bold text-brand">
          {index}
        </span>
      )}
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mb-8 mt-3 text-muted">{description}</p>
      <ButtonLink href={href} variant="outline" className="mt-auto self-start">
        {actionLabel}
      </ButtonLink>
    </article>
  );
}
