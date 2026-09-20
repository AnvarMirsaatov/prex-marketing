export function SectionTitle({
  title,
  eyebrow,
  description,
  as: Heading = "h2",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  as?: "h1" | "h2" | "h3";
  inverse?: boolean;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
          {eyebrow}
        </p>
      )}
      <Heading
        className={`${Heading === "h1" ? "text-display" : "text-heading"} font-black tracking-tight text-white leading-tight`}
      >
        {title}
      </Heading>
      {description && (
        <p className="max-w-2xl text-body text-slate-300 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
