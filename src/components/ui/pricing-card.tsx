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
    <article className="interactive-card relative flex h-full flex-col rounded-card border border-blue-500/15 bg-[#0a1326]/70 backdrop-blur-md p-6 sm:p-8 overflow-hidden group">
      <div className="absolute -top-12 -right-12 size-32 rounded-full bg-blue-600/10 blur-2xl group-hover:bg-sky-400/20 transition-all duration-300 pointer-events-none" />

      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="my-6 flex flex-wrap items-baseline gap-2">
        <strong className="text-heading font-black text-white tracking-tight">{price}</strong>
        {period && <span className="text-sm font-medium text-slate-400">{period}</span>}
      </p>
      {description && <p className="mb-6 text-sm leading-relaxed text-slate-400 flex-1">{description}</p>}
      <ButtonLink href={href} variant="outline" className="mt-auto w-full border-blue-500/25 hover:border-sky-400/50 hover:bg-blue-500/15 text-slate-200 hover:text-white">
        {actionLabel}
      </ButtonLink>
    </article>
  );
}
