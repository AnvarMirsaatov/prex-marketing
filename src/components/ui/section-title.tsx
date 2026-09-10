export function SectionTitle({
  title,
  eyebrow,
  description,
  as: Heading = "h2",
  inverse = false,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  as?: "h1" | "h2" | "h3";
  inverse?: boolean;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow && (
        <p
          className={`text-label font-bold uppercase tracking-widest ${inverse ? "text-accent" : "text-brand"}`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`${Heading === "h1" ? "text-display" : "text-heading"} font-bold tracking-tight ${inverse ? "text-paper" : "text-ink"}`}
      >
        {title}
      </Heading>
      {description && (
        <p className={`max-w-2xl text-body ${inverse ? "text-paper" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
