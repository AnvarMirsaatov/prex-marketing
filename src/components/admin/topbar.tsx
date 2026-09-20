"use client";

import { useEffect, useState } from "react";
import { FollowUpBell } from "@/components/admin/notifications/follow-up-bell";
import { Shield, Calendar } from "lucide-react";

interface CurrentUser {
  userId: string;
  username: string;
  name: string;
  role: string;
}

export function AdminTopbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [todayText, setTodayText] = useState("");

  useEffect(() => {
    async function loadAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadAuth();

    // Format current date in Uzbek
    try {
      const now = new Date();
      const formatted = now.toLocaleDateString("uz-UZ", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setTodayText(formatted.charAt(0).toUpperCase() + formatted.slice(1));
    } catch {
      setTodayText("Bugun");
    }
  }, []);

  const isSuperAdmin = (user?.role || "").toUpperCase() === "SUPER_ADMIN";

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-3.5 border-b border-blue-900/20 bg-[#070e1c]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Left side: Date & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Calendar className="size-3.5 text-blue-400" />
          <span>{todayText}</span>
        </div>
        <span className="text-blue-900/40">•</span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tizim faol</span>
        </div>
      </div>

      {/* Right side: Follow-up Notification Bell & User profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <FollowUpBell />

        <div className="h-6 w-px bg-blue-900/30" />

        {/* User profile capsule */}
        {user && (
          <div className="flex items-center gap-2.5 pl-1">
            <div
              className={`size-8 rounded-xl flex items-center justify-center text-xs font-bold border shadow-inner ${
                isSuperAdmin
                  ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                  : "bg-sky-600/20 border-sky-500/40 text-sky-200"
              }`}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-300">
                    <Shield className="size-2.5" /> Super Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-sky-300">
                    Menejer
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
