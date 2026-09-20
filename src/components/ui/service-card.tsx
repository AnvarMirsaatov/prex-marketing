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
    <article className="interactive-card relative flex h-full flex-col rounded-card border border-blue-500/15 bg-[#0a1326]/70 backdrop-blur-md p-6 sm:p-8 overflow-hidden group">
      {/* Ambient subtle glow on hover */}
      <div className="absolute -top-12 -right-12 size-36 rounded-full bg-blue-600/10 blur-2xl group-hover:bg-sky-400/20 transition-all duration-300 pointer-events-none" />

      {index && (
        <span
          aria-hidden="true"
          className="mb-6 font-mono text-xs font-black tracking-widest text-sky-400 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 w-fit inline-block"
        >
          {index}
        </span>
      )}
      <h3 className="text-xl font-bold text-white group-hover:text-sky-200 transition-colors duration-200">
        {title}
      </h3>
      <p className="mb-8 mt-3 text-sm leading-relaxed text-slate-400 flex-1">
        {description}
      </p>
      <ButtonLink href={href} variant="outline" className="mt-auto self-start border-blue-500/25 hover:border-sky-400/50 hover:bg-blue-500/15 text-slate-200 hover:text-white">
        {actionLabel}
      </ButtonLink>
    </article>
  );
}
