import type { Metadata } from "next";
import { ToastProvider } from "@/components/providers/toast-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Prox Marketing — Admin Panel",
  description: "Prox Marketing boshqaruv tizimi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="bg-[#050b14] text-slate-100 min-h-screen flex antialiased selection:bg-blue-600 selection:text-white relative">
        {/* ── Luxury Background Pattern Layer ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 0 }}
        >
          {/* Tech Grid Pattern */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='none'/%3E%3Cpath d='M0 40L40 40' stroke='rgba(59,130,246,0.035)' stroke-width='0.5'/%3E%3Cpath d='M40 0L40 40' stroke='rgba(59,130,246,0.035)' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Dot Matrix Overlay */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='rgba(148,163,184,0.025)'/%3E%3C/svg%3E")`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Radial Glow — Top Right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 90% 5%, rgba(37,99,235,0.07), transparent 70%)",
            }}
          />

          {/* Radial Glow — Bottom Left (subtle secondary) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 10% 90%, rgba(56,189,248,0.04), transparent 65%)",
            }}
          />

          {/* Subtle center vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(5,11,20,0.5) 100%)",
            }}
          />
        </div>

        {/* ── Main Content (above pattern) ── */}
        <div className="relative flex-1 flex min-h-screen" style={{ zIndex: 1 }}>
          <ToastProvider>{children}</ToastProvider>
        </div>
      </body>
    </html>
  );
}
