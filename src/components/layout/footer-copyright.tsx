"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

export function FooterCopyright({ siteName }: { siteName: string }) {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  function handleTripleClick() {
    setClickCount((prev) => {
      const updated = prev + 1;
      if (updated >= 3) {
        router.push("/admin");
        return 0;
      }
      return updated;
    });
  }

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  return (
    <div className="flex items-center justify-center gap-2 select-none">
      <span
        onClick={handleTripleClick}
        className="cursor-pointer hover:text-slate-400 transition-colors"
        title="Prox Marketing Agency"
      >
        © {new Date().getFullYear()} {siteName}. Barcha huquqlar himoyalangan.
      </span>
      <Link
        href="/admin"
        className="text-slate-600 hover:text-slate-400 transition-colors p-0.5 inline-flex items-center opacity-30 hover:opacity-100"
        title="Admin Panel"
        aria-label="Admin panel"
      >
        <Lock className="size-2.5" />
      </Link>
    </div>
  );
}
