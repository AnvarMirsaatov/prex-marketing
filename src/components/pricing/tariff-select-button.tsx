"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface TariffSelectButtonProps {
  tariffName: string;
  serviceType?: string;
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
}

export function TariffSelectButton({
  tariffName,
  serviceType,
  label = "Tanlash",
  variant = "primary",
  className = "",
}: TariffSelectButtonProps) {
  function handleSelect() {
    if (typeof window !== "undefined") {
      // 1. Dispatch custom event for ConsultationForm
      window.dispatchEvent(
        new CustomEvent("select-service-plan", {
          detail: {
            tariff: tariffName,
            service: serviceType || tariffName,
            source: "tariff-card",
          },
        })
      );

      // 2. Smooth scroll to #consultation form
      const target = document.getElementById("consultation");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const baseStyles =
    "w-full inline-flex items-center justify-center gap-2 rounded-control px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98]";
  const variantStyles =
    variant === "primary"
      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30"
      : "bg-blue-950/60 hover:bg-blue-900/60 text-slate-200 hover:text-white border border-blue-500/25 hover:border-sky-400/50";

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <span>{label}</span>
      <ArrowRight className="size-4" />
    </button>
  );
}
