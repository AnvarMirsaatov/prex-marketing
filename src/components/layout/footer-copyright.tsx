"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { AdminLoginModal } from "@/components/auth/admin-login-modal";

export function FooterCopyright({ siteName }: { siteName: string }) {
  const [clickCount, setClickCount] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  function handleTripleClick() {
    setClickCount((prev) => {
      const updated = prev + 1;
      if (updated >= 3) {
        setLoginModalOpen(true);
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
    <>
      <div className="flex items-center justify-center gap-2 select-none">
        <span
          onClick={handleTripleClick}
          className="cursor-pointer hover:text-slate-400 transition-colors"
          title="Prox Marketing Agency"
        >
          © {new Date().getFullYear()} {siteName}. Barcha huquqlar himoyalangan.
        </span>
        <button
          type="button"
          onClick={() => setLoginModalOpen(true)}
          className="text-slate-600 hover:text-slate-400 transition-colors p-0.5 inline-flex items-center opacity-30 hover:opacity-100 cursor-pointer"
          title="Admin Panel"
          aria-label="Admin panel"
        >
          <Lock className="size-2.5" />
        </button>
      </div>

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
