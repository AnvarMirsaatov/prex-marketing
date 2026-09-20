"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save, Phone, Send, Bot } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface SettingsData {
  phone: string;
  phoneHref: string;
  instagram: string;
  instagramLabel: string;
  telegram: string;
  telegramLabel: string;
  heroEyebrowUz: string;
  heroEyebrowRu: string;
  heroTitleUz: string;
  heroTitleRu: string;
  heroDescUz: string;
  heroDescRu: string;
  addressUz: string;
  addressRu: string;
  email: string;
  telegramBotToken: string;
  telegramChatId: string;
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SettingsData>({
    phone: "+998 20 026 04 18",
    phoneHref: "tel:+998200260418",
    instagram: "https://www.instagram.com/prox_uz/",
    instagramLabel: "@prox_uz",
    telegram: "https://t.me/manager_prox",
    telegramLabel: "@manager_prox",
    heroEyebrowUz: "Prox Marketing Agency",
    heroEyebrowRu: "Prox Marketing Agency",
    heroTitleUz: "Biznesingizni yangi bosqichga olib chiqamiz",
    heroTitleRu: "Выводим ваш бизнес на новый уровень",
    heroDescUz:
      "Prox — bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi.",
    heroDescRu:
      "Prox — digital-маркетинговое агентство, специализирующееся на системном развитии бизнеса в цифровой среде и увеличении продаж.",
    addressUz: "Toshkent shahri",
    addressRu: "город Ташкент",
    email: "info@proxmarketing.uz",
    telegramBotToken: "",
    telegramChatId: "",
  });

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setForm((prev) => ({ ...prev, ...data.settings }));
      }
    } catch {
      showToast("Sozlamalarni yuklab bo'lmadi", "error");
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast("Sozlamalar muvaffaqiyatli saqlandi!", "success");
      } else {
        showToast("Saqlashda xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Sayt Sozlamalari</h1>
        <p className="text-sm text-slate-400">
          Asosiy aloqa ma'lumotlari, ijtimoiy tarmoqlar, Telegram bot va bosh sahifa matnlari
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Aloqa ma'lumotlari */}
        <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/20 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Phone className="size-4 text-sky-400" />
            <span>Aloqa va Ijtimoiy Tarmoqlar</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Telefon raqami
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email manzil
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Telegram Link
              </label>
              <input
                type="text"
                value={form.telegram}
                onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                placeholder="https://t.me/manager_prox"
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Telegram Label
              </label>
              <input
                type="text"
                value={form.telegramLabel}
                onChange={(e) => setForm({ ...form, telegramLabel: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Instagram Link
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/prox_uz"
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Instagram Label
              </label>
              <input
                type="text"
                value={form.instagramLabel}
                onChange={(e) => setForm({ ...form, instagramLabel: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero matnlari */}
        <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/20 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="size-4 text-sky-400" />
            <span>Bosh Sahifa Hero Matnlari</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Sarlavha (UZ)
              </label>
              <input
                type="text"
                value={form.heroTitleUz}
                onChange={(e) => setForm({ ...form, heroTitleUz: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Sarlavha (RU)
              </label>
              <input
                type="text"
                value={form.heroTitleRu}
                onChange={(e) => setForm({ ...form, heroTitleRu: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tavsif (UZ)
              </label>
              <textarea
                rows={3}
                value={form.heroDescUz}
                onChange={(e) => setForm({ ...form, heroDescUz: e.target.value })}
                className="w-full p-3 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tavsif (RU)
              </label>
              <textarea
                rows={3}
                value={form.heroDescRu}
                onChange={(e) => setForm({ ...form, heroDescRu: e.target.value })}
                className="w-full p-3 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Telegram Bot Integratsiyasi */}
        <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/20 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="size-4 text-sky-400" />
              <span>Telegram Bot Xabarnomalari (Leadlar uchun)</span>
            </h2>
            <span className="text-[11px] text-slate-500">Ixtiyoriy</span>
          </div>
          <p className="text-xs text-slate-400">
            Saytdan so'rov qoldirilganda Telegram guruh yoki adminga darhol xabar borishi uchun bot token va chat ID kiriting:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Bot Token (masalan: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)
              </label>
              <input
                type="text"
                value={form.telegramBotToken || ""}
                onChange={(e) => setForm({ ...form, telegramBotToken: e.target.value })}
                placeholder="123456:ABC..."
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm font-mono focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Chat ID (yoki Guruh ID)
              </label>
              <input
                type="text"
                value={form.telegramChatId || ""}
                onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })}
                placeholder="-100123456789"
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm font-mono focus:border-blue-500/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>O'zgarishlarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}
