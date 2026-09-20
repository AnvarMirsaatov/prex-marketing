"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Tags,
  Users,
  Image,
  UserCheck,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "So'rovlar (Leads)", icon: Inbox },
  { href: "/admin/services", label: "Xizmatlar", icon: Briefcase },
  { href: "/admin/tariffs", label: "Tariflar", icon: Tags },
  { href: "/admin/partners", label: "Hamkorlar", icon: Users },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/team", label: "Jamoa", icon: UserCheck },
  { href: "/admin/settings", label: "Sozlamalar", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, do not render sidebar
  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  const navContent = (
    <div className="flex flex-col h-full bg-[#070e1c] border-r border-blue-900/20 p-4 w-64 text-slate-200">
      {/* Brand header */}
      <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-blue-900/20">
        <div>
          <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
            PROX <span className="text-sky-400">.</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-300/60 mt-0.5">
            Boshqaruv Paneli
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 font-semibold"
                  : "text-slate-400 hover:text-sky-200 hover:bg-blue-950/40"
              }`}
            >
              <Icon className={`size-4.5 ${isActive ? "text-sky-200" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="pt-4 border-t border-blue-900/20 space-y-2">
        <Link
          href="/uz"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-blue-950/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="size-4 text-blue-400" />
            Saytni ko'rish
          </span>
          <span className="text-[10px] bg-blue-950/60 text-blue-300 border border-blue-800/40 px-1.5 py-0.5 rounded">
            UZ
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer text-left"
        >
          <LogOut className="size-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Bar & Drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#070e1c] border-b border-blue-900/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-slate-300 hover:text-white"
          >
            <Menu className="size-6" />
          </button>
          <span className="font-black text-lg text-white">PROX ADMIN</span>
        </div>
        <Link
          href="/uz"
          target="_blank"
          className="text-xs bg-blue-950/80 border border-blue-800/40 px-2.5 py-1.5 rounded-lg text-blue-200 flex items-center gap-1.5 hover:bg-blue-900/60 transition-colors"
        >
          <span>Sayt</span>
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden">
          <div className="w-64 h-full">{navContent}</div>
        </div>
      )}
    </>
  );
}
