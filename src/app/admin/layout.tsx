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
      <body className="bg-[#050b14] text-slate-100 min-h-screen flex antialiased selection:bg-blue-600 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
