"use client";

import { useState, type FormEvent } from "react";
import { Lock, User, ArrowRight, ShieldCheck, X, Eye, EyeOff, AlertCircle } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login yoki parol xato!");
      }

      const role = (data.user?.role || "").toUpperCase();
      const targetUrl = role === "SUPER_ADMIN" ? "/admin" : "/admin/leads";
      window.location.href = targetUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login yoki parol xato!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-sky-500/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0a1326]/95 border border-blue-500/30 rounded-3xl p-7 sm:p-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-blue-900/30 transition-colors"
          aria-label="Yopish"
        >
          <X className="size-5" />
        </button>

        {/* Modal header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-13 rounded-2xl bg-blue-500/10 text-sky-400 border border-blue-500/20 mb-3.5 shadow-inner">
            <ShieldCheck className="size-6.5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            PROX <span className="text-sky-400">.</span> ADMIN
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Boshqaruv tizimiga xavfsiz kirish
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in shake-1 duration-150">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Login
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Login yoki foydalanuvchi nomi"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#070e1b] border border-blue-500/25 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Parol
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#070e1b] border border-blue-500/25 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Kirish</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
