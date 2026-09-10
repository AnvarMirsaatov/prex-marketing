import type { Metadata } from "next";
import { AdminNav } from "./admin-nav";
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
      <body className="bg-slate-950 text-slate-100 min-h-screen flex antialiased">
        <ToastProvider>
          <div className="flex w-full min-h-screen">
            <AdminNav />
            <main className="flex-1 flex flex-col min-w-0 bg-slate-900/50 overflow-y-auto">
              <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
