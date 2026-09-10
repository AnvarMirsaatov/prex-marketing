import Image from "next/image";
export function PartnerLogo({
  src,
  alt,
  placeholder,
}: {
  src?: string;
  alt: string;
  placeholder?: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-card border border-line bg-paper p-6">
      {src ? (
        <Image src={src} alt={alt} width={180} height={80} className="h-20 w-full object-contain" />
      ) : (
        <span className="text-center text-label text-muted">{placeholder ?? alt}</span>
      )}
    </div>
  );
}
