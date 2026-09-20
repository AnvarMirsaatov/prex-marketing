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
    <div className="flex min-h-32 items-center justify-center rounded-card border border-blue-500/15 bg-[#0a1326]/60 backdrop-blur-md p-6 hover:border-blue-500/35 hover:bg-[#0f1c38]/80 transition-all duration-300 group shadow-[0_4px_20px_rgba(2,6,23,0.5)]">
      {src ? (
        <Image src={src} alt={alt} width={180} height={80} className="h-20 w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
      ) : (
        <span className="text-center text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">{placeholder ?? alt}</span>
      )}
    </div>
  );
}
