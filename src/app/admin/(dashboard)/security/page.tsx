"use client";

import { useState, type FormEvent } from "react";
import { ShieldCheck, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export default function AdminSecurityPage() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);

    if (!currentPassword) {
      showToast("Joriy parolni kiriting", "warning");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showToast("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Yangi parollar bir-biriga mos kelmadi", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Parol muvaffaqiyatli yangilandi", "success");
        setSuccessMessage("Parolingiz muvaffaqiyatli o'zgartirildi!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.error || "Parolni o'zgartirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi yuz berdi", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="size-3.5" />
          <span>Xavfsizlik Boshqaruvi</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">Kirish Parolini O'zgartirish</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dasturchisiz, o'zingiz istagan vaqtda joriy parolni kiritib yangisiga yangilang.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-[#0a1326] border border-blue-900/30 shadow-xl space-y-5"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Hozirgi (eski) parol
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Joriy parolingizni kiriting"
              className="w-full px-4 py-2.5 pr-11 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none transition-all placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Yangi parol
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yangi parol (kamida 6 ta belgi)"
              className="w-full px-4 py-2.5 pr-11 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none transition-all placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Maslahat: Harflar va raqamlar aralashmasidan foydalaning.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Yangi parolni tasdiqlash
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yangi parolni qayta kiriting"
            className="w-full px-4 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="pt-4 border-t border-blue-900/20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <KeyRound className="size-4" />
            )}
            <span>Parolni yangilash</span>
          </button>
        </div>
      </form>
    </div>
  );
}
