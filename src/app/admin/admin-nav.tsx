"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  X,
  UserCog,
  KeyRound,
  Shield,
  History,
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FollowUpBell } from "@/components/admin/notifications/follow-up-bell";

interface CurrentUser {
  userId: string;
  username: string;
  name: string;
  role: string;
}

const SUPER_ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "So'rovlar (Leads)", icon: Inbox },
  { href: "/admin/content", label: "Sayt kontenti", icon: Layers },
  { href: "/admin/users", label: "Adminlar", icon: UserCog },
  { href: "/admin/audit", label: "Harakatlar tarixi", icon: History },
  { href: "/admin/security", label: "Xavfsizlik & Parol", icon: KeyRound },
];

const ADMIN_NAV = [
  { href: "/admin/leads", label: "So'rovlar (Leads)", icon: Inbox },
  { href: "/admin/security", label: "Parolni o'zgartirish", icon: KeyRound },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoWidth, setLogoWidth] = useState<number>(160);
  const [logoHeight, setLogoHeight] = useState<number | null>(45);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          if (data.logoWidth) setLogoWidth(data.logoWidth);
          if (data.logoHeight !== undefined) setLogoHeight(data.logoHeight);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }
    checkAuth();

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ logoUrl?: string | null; logoWidth?: number | null; logoHeight?: number | null }>;
      if (customEvent.detail?.logoUrl !== undefined) {
        setLogoUrl(customEvent.detail.logoUrl);
      }
      if (customEvent.detail?.logoWidth != null) {
        setLogoWidth(customEvent.detail.logoWidth);
      }
      if (customEvent.detail?.logoHeight !== undefined) {
        setLogoHeight(customEvent.detail.logoHeight);
      }
    };
    window.addEventListener("prox-logo-updated", handler);
    return () => window.removeEventListener("prox-logo-updated", handler);
  }, []);

  // If on login page, do not render sidebar
  if (pathname === "/admin/login") return null;

  const isSuperAdmin = (user?.role || "").toUpperCase() === "SUPER_ADMIN";
  const navItems = isSuperAdmin ? SUPER_ADMIN_NAV : ADMIN_NAV;

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
    <div className="flex flex-col h-full bg-[#070e1c] border-r border-blue-900/20 p-4 w-full text-slate-200">
      {/* Brand header */}
      <div className="flex items-center justify-between px-3 py-4 mb-4 border-b border-blue-900/20">
        <div>
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <div
              style={{
                width: `${Math.min(logoWidth, 140)}px`,
                height: `${logoHeight ?? 36}px`,
                maxWidth: "140px",
              }}
            >
              <img
                src={logoUrl}
                alt="Prox Logo"
                className="w-full h-full object-contain object-left mb-1"
              />
            </div>
          ) : (
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              PROX <span className="text-sky-400">.</span>
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-300/60 mt-0.5">
            Boshqaruv Paneli
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Menyuni yopish"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* User profile capsule */}
      {user && (
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-[#0b162b] border border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <div
              className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                isSuperAdmin
                  ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                  : "bg-sky-600/20 border-sky-500/40 text-sky-200"
              }`}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-300">
                    <Shield className="size-2.5" /> Super Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-sky-300">
                    Menejer
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
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
      {/* Desktop Sidebar (>= 1024px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile & Tablet Bar (< 1024px) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#070e1c]/95 backdrop-blur-md border-b border-blue-900/20 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
            aria-label="Menyuni ochish"
          >
            <Menu className="size-6" />
          </button>
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <div
              style={{
                width: `${Math.min(logoWidth, 110)}px`,
                height: "32px",
                maxWidth: "110px",
              }}
            >
              <img
                src={logoUrl}
                alt="Prox Logo"
                className="w-full h-full object-contain object-left"
              />
            </div>
          ) : (
            <span className="font-black text-lg text-white">PROX ADMIN</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FollowUpBell />
          <Link
            href="/uz"
            target="_blank"
            className="text-xs bg-blue-950/80 border border-blue-800/40 px-3 py-1.5 rounded-lg text-blue-200 flex items-center gap-1.5 hover:bg-blue-900/60 transition-colors"
          >
            <span>Sayt</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Modal with Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full shadow-2xl shadow-blue-950/80 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
