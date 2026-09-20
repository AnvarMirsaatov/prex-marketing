"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import {
  Save,
  Phone,
  Send,
  Bot,
  Upload,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface SettingsData {
  logoUrl: string | null;
  logoText: string;
  logoWidth: number | null;
  logoHeight: number | null;
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

export function TabBranding() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoHeight, setAutoHeight] = useState(true);

  const [form, setForm] = useState<SettingsData>({
    logoUrl: null,
    logoText: "PROX",
    logoWidth: 160,
    logoHeight: 45,
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
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setForm((prev) => ({
          ...prev,
          ...data.settings,
          logoUrl: data.settings.logoUrl || null,
          logoText: data.settings.logoText || "PROX",
          logoWidth: data.settings.logoWidth ?? 160,
          logoHeight: data.settings.logoHeight ?? 45,
        }));
        // autoHeight only if logoHeight was explicitly stored as null
        if (data.settings.logoHeight === null) {
          setAutoHeight(true);
        } else {
          setAutoHeight(false);
        }
      }
    } catch {
      showToast("Sozlamalarni yuklab bo'lmadi", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Faqat rasm fayllari (SVG, PNG, WebP, JPG) qabul qilinadi", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Rasm hajmi 10MB dan oshmasligi kerak", "error");
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
        showToast("Logotip fayli muvaffaqiyatli yuklandi!", "success");
      } else {
        showToast(data.error || "Logotip yuklashda xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Fayl yuklashda server xatosi", "error");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      logoHeight: autoHeight ? null : form.logoHeight,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Sozlamalar va logotip muvaffaqiyatli saqlandi!", "success");
        // Notify other admin components (e.g. AdminNav)
        window.dispatchEvent(
          new CustomEvent("prox-logo-updated", {
            detail: {
              logoUrl: form.logoUrl,
              logoWidth: form.logoWidth,
              logoHeight: autoHeight ? null : form.logoHeight,
            },
          })
        );
      } else {
        showToast("Saqlashda xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500">
        <RefreshCw className="size-7 animate-spin mx-auto mb-3 text-sky-400" />
        <p className="text-sm">Sozlamalar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* 1. Sayt Logotipi & Brending */}
      <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-blue-900/20 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="size-4.5 text-sky-400" />
              <span>Sayt Logotipi & Brending</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Saytning asosiy Header, Footer va boshqaruv panelidagi logotipini hamda o'lchamlarini boshqaring
            </p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold w-fit ${
              form.logoUrl
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                : "bg-blue-500/20 text-sky-300 border border-blue-500/30"
            }`}
          >
            {form.logoUrl ? (
              <>
                <CheckCircle2 className="size-3" />
                <span>Maxsus logotip faol</span>
              </>
            ) : (
              "Standart matnli logotip"
            )}
          </span>
        </div>

        {/* Live Preview & Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Live Preview Box */}
          <div className="flex flex-col justify-center items-center p-6 rounded-2xl bg-[#050b14] border border-blue-900/40 min-h-[190px] relative overflow-hidden text-center group">
            <div className="absolute inset-0 bg-radial from-blue-600/10 via-transparent to-transparent pointer-events-none" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 block">
              Jonli Ko'rinish (Live Preview)
            </span>

            {/* Always show preview — custom logo or /logo.png fallback */}
            <div className="w-full flex flex-col items-center justify-center">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-blue-500/20 flex items-center justify-center overflow-hidden">
                <div
                  style={{
                    width: `${form.logoWidth ?? 160}px`,
                    height: autoHeight || !form.logoHeight ? "45px" : `${form.logoHeight}px`,
                    maxWidth: "100%",
                  }}
                  className="flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logoUrl || "/logo.png"}
                    alt="Site Logo Preview"
                    className="w-full h-full object-contain object-center transition-all duration-150 group-hover:scale-105"
                    onError={(e) => {
                      // If /logo.png also fails, hide silently
                      (e.target as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
              </div>
              <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-2">
                <span className="font-semibold text-sky-400">
                  O&apos;lcham: {form.logoWidth || 160}px ×{" "}
                  {autoHeight || !form.logoHeight ? "45px (auto)" : `${form.logoHeight}px`}
                </span>
                {!form.logoUrl && (
                  <span className="text-slate-500 italic">(/logo.png standart)</span>
                )}
              </div>
            </div>
          </div>

          {/* Upload & URL Controls */}
          <div className="space-y-3.5 flex flex-col justify-center">
            {/* File Upload Button */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Yangi logotip yuklash (SVG, PNG, WebP)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/webp,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-blue-600/25 disabled:opacity-50"
                >
                  <Upload className="size-4" />
                  <span>{uploadingLogo ? "Yuklanmoqda..." : "Fayl tanlash"}</span>
                </button>

                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, logoUrl: null }))}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    title="Logotipni olib tashlash va matnliga qaytarish"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Tozalash</span>
                  </button>
                )}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Tavsiya: Shaffof fonli SVG yoki PNG (balandligi 40-60px)
              </span>
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <LinkIcon className="size-3 text-sky-400" />
                <span>Yoki rasm URL manzilini kiriting:</span>
              </label>
              <input
                type="text"
                value={form.logoUrl || ""}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value || null })}
                placeholder="https://... yoki /uploads/logo.svg"
                className="w-full px-3.5 py-2 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-xs placeholder:text-slate-500 focus:border-blue-500/60 focus:outline-none"
              />
            </div>

            {/* Brand Title Fallback */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Brend matni (Logotip bo'lmaganda chiqadi)
              </label>
              <input
                type="text"
                value={form.logoText}
                onChange={(e) => setForm({ ...form, logoText: e.target.value })}
                placeholder="PROX"
                className="w-full px-3.5 py-2 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-xs focus:border-blue-500/60 focus:outline-none font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Aloqa va Ijtimoiy Tarmoqlar */}
      <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-blue-900/20 pb-3">
          <Phone className="size-4.5 text-sky-400" />
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
              Telegram Havolasi (URL)
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
              Telegram Ko'rinishi (Label)
            </label>
            <input
              type="text"
              value={form.telegramLabel}
              onChange={(e) => setForm({ ...form, telegramLabel: e.target.value })}
              placeholder="@manager_prox"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Instagram Havolasi (URL)
            </label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://www.instagram.com/prox_uz/"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Instagram Ko'rinishi (Label)
            </label>
            <input
              type="text"
              value={form.instagramLabel}
              onChange={(e) => setForm({ ...form, instagramLabel: e.target.value })}
              placeholder="@prox_uz"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Manzil (O'zbek tilida)
            </label>
            <input
              type="text"
              value={form.addressUz}
              onChange={(e) => setForm({ ...form, addressUz: e.target.value })}
              placeholder="Toshkent shahri"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Manzil (Rus tilida)
            </label>
            <input
              type="text"
              value={form.addressRu}
              onChange={(e) => setForm({ ...form, addressRu: e.target.value })}
              placeholder="город Ташкент"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Telegram Bot Integratsiyasi */}
      <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-4 shadow-sm">
        <div className="border-b border-blue-900/20 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="size-4.5 text-sky-400" />
            <span>Telegram Bot Integratsiyasi (Lid Xabarnomalari)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sayt orqali kelib tushgan yangi arizalarni Telegram guruhingizga avtomatik jo'natish
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Telegram Bot Token
            </label>
            <input
              type="password"
              value={form.telegramBotToken}
              onChange={(e) => setForm({ ...form, telegramBotToken: e.target.value })}
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Telegram Chat ID (Kanal yoki Guruh)
            </label>
            <input
              type="text"
              value={form.telegramChatId}
              onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })}
              placeholder="-1001234567890"
              className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Bosh Sahifa Asosiy Matnlari */}
      <div className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-4 shadow-sm">
        <div className="border-b border-blue-900/20 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="size-4.5 text-sky-400" />
            <span>Bosh Sahifa Standart Matnlari</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hero banner matnlari va agentlikning asosiy shiori (UZ va RU tillarida)
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Eyebrow (UZ)
              </label>
              <input
                type="text"
                value={form.heroEyebrowUz}
                onChange={(e) => setForm({ ...form, heroEyebrowUz: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Eyebrow (RU)
              </label>
              <input
                type="text"
                value={form.heroEyebrowRu}
                onChange={(e) => setForm({ ...form, heroEyebrowRu: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Bosh Sarlavha (UZ)
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
                Bosh Sarlavha (RU)
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
                Tavsif matni (UZ)
              </label>
              <textarea
                rows={3}
                value={form.heroDescUz}
                onChange={(e) => setForm({ ...form, heroDescUz: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tavsif matni (RU)
              </label>
              <textarea
                rows={3}
                value={form.heroDescRu}
                onChange={(e) => setForm({ ...form, heroDescRu: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm focus:border-blue-500/60 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 border border-blue-400/30 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="size-4" />
          <span>{saving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}</span>
        </button>
      </div>
    </form>
  );
}
