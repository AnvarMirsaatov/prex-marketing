/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef, type FormEvent, type ChangeEvent } from "react";
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Layers,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface HeroSlideItem {
  id: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  badgeUz: string | null;
  badgeRu: string | null;
  imageUrl: string | null;
  buttonTextUz: string | null;
  buttonTextRu: string | null;
  serviceTarget: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHeroCarouselPage() {
  const { showToast } = useToast();
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null);

  // Form states
  const [titleUz, setTitleUz] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descUz, setDescUz] = useState("");
  const [descRu, setDescRu] = useState("");
  const [badgeUz, setBadgeUz] = useState("");
  const [badgeRu, setBadgeRu] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [buttonTextUz, setButtonTextUz] = useState("Ariza qoldirish");
  const [buttonTextRu, setButtonTextRu] = useState("Оставить заявку");
  const [serviceTarget, setServiceTarget] = useState("SMM");
  const [order, setOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);

  // Upload states
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchSlides() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (res.ok) {
        setSlides(data.slides || []);
      } else {
        showToast(data.error || "Slaydlarni yuklab bo'lmadi", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlides();
  }, []);

  function openCreate() {
    setEditingSlide(null);
    setTitleUz("");
    setTitleRu("");
    setDescUz("");
    setDescRu("");
    setBadgeUz("");
    setBadgeRu("");
    setImageUrl("");
    setButtonTextUz("Ariza qoldirish");
    setButtonTextRu("Оставить заявку");
    setServiceTarget("SMM");
    setOrder(String((slides.length || 0) + 1));
    setIsActive(true);
    setImageMode("upload");
    setModalOpen(true);
  }

  function openEdit(slide: HeroSlideItem) {
    setEditingSlide(slide);
    setTitleUz(slide.titleUz);
    setTitleRu(slide.titleRu);
    setDescUz(slide.descUz);
    setDescRu(slide.descRu);
    setBadgeUz(slide.badgeUz || "");
    setBadgeRu(slide.badgeRu || "");
    setImageUrl(slide.imageUrl || "");
    setButtonTextUz(slide.buttonTextUz || "Ariza qoldirish");
    setButtonTextRu(slide.buttonTextRu || "Оставить заявку");
    setServiceTarget(slide.serviceTarget || "SMM");
    setOrder(String(slide.order));
    setIsActive(slide.isActive);
    setImageMode(slide.imageUrl && !slide.imageUrl.startsWith("/uploads/") ? "url" : "upload");
    setModalOpen(true);
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        showToast("Rasm muvaffaqiyatli yuklandi!", "success");
      } else {
        showToast(data.error || "Rasm yuklashda xatolik", "error");
      }
    } catch {
      showToast("Rasm yuklashda server xatosi", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!titleUz.trim() || !titleRu.trim() || !descUz.trim() || !descRu.trim()) {
      showToast("Sarlavha va tavsif (UZ & RU) maydonlarini to'ldiring", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        titleUz,
        titleRu,
        descUz,
        descRu,
        badgeUz,
        badgeRu,
        imageUrl,
        buttonTextUz,
        buttonTextRu,
        serviceTarget,
        order: Number(order) || 0,
        isActive,
      };

      let res: Response;
      if (editingSlide) {
        res = await fetch("/api/admin/hero", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSlide.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (res.ok) {
        showToast(
          editingSlide ? "Slayd muvaffaqiyatli yangilandi!" : "Yangi slayd qo'shildi!",
          "success"
        );
        setModalOpen(false);
        fetchSlides();
      } else {
        showToast(data.error || "Saqlashda xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slide: HeroSlideItem) {
    const confirmed = confirm(`"${slide.titleUz}" slaydini o'chirishni tasdiqlaysizmi?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/hero?id=${slide.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("Slayd o'chirildi", "success");
        fetchSlides();
      } else {
        showToast(data.error || "O'chirishda xatolik", "error");
      }
    } catch {
      showToast("Server bilan aloqa xatosi", "error");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === slides.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const reorderPayload = newSlides.map((s, idx) => ({ id: s.id, order: idx + 1 }));
    setSlides(newSlides);

    try {
      await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: reorderPayload }),
      });
      showToast("Ketma-ketlik yangilandi", "success");
    } catch {
      showToast("Ketma-ketlikni saqlab bo'lmadi", "error");
      fetchSlides();
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/20">
        <div>
          <div className="flex items-center gap-2.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sliders className="size-4" />
            <span>Boshqaruv Modullari</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hero Karusel (Bannerlar)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Bosh sahifadagi kinematik karusel slaydlarini boshqaring. Rasm yoki video fonlar, sarlavha va matnlar real vaqtda saytda aks etadi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/uz"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-900/40 transition-all"
          >
            <span>Saytda ko&apos;rish</span>
            <ExternalLink className="size-3.5" />
          </a>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="size-4" />
            <span>Yangi Slayd Qo&apos;shish</span>
          </button>
        </div>
      </div>

      {/* Slides List */}
      <div className="bg-[#0a1326]/70 border border-blue-900/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="px-6 py-4 border-b border-blue-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="size-4.5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Faol va No-faol Slaydlar</h3>
          </div>
          <span className="text-xs font-semibold text-blue-300/80 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-lg">
            Jami: {slides.length} ta slayd
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Slaydlar yuklanmoqda...</div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Hozircha birorta ham slayd mavjud emas. Yuqoridagi &quot;Yangi Slayd Qo&apos;shish&quot; tugmasini bosing.
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-blue-950/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Image preview / Icon placeholder */}
                  <div className="relative size-20 sm:size-24 rounded-2xl bg-[#070e1c] border border-blue-800/40 overflow-hidden shrink-0 flex items-center justify-center group shadow-md">
                    {slide.imageUrl ? (
                      <img
                        src={slide.imageUrl}
                        alt={slide.titleUz}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/40 via-sky-900/20 to-[#070e1c] flex items-center justify-center text-sky-400">
                        <ImageIcon className="size-8 opacity-60" />
                      </div>
                    )}
                    <div className="absolute top-1.5 left-1.5 size-5.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/20 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {slide.badgeUz && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-sky-300 border border-blue-500/30">
                          {slide.badgeUz}
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/70 text-slate-300 border border-slate-700/40">
                        {slide.serviceTarget || "SMM"}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          slide.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {slide.isActive ? "Faol" : "O'chirilgan"}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug line-clamp-1">
                      {slide.titleUz}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                      {slide.descUz}
                    </p>

                    <div className="text-[11px] text-slate-500 italic line-clamp-1">
                      RU: {slide.titleRu}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <div className="flex items-center rounded-xl bg-blue-950/60 border border-blue-800/40 p-1">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-blue-800/40 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Yuqoriga surish"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === slides.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-blue-800/40 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Pastga surish"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2.5 rounded-xl text-sky-400 hover:text-sky-200 hover:bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                    title="Tahrirlash"
                  >
                    <Edit2 className="size-3.5" />
                    <span>Tahrirlash</span>
                  </button>

                  <button
                    onClick={() => handleDelete(slide)}
                    className="p-2.5 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                    title="O'chirish"
                  >
                    <Trash2 className="size-3.5" />
                    <span>O&apos;chirish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a1326] border border-blue-900/40 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-blue-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sky-400 flex items-center justify-center">
                  <Sliders className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {editingSlide ? "Slaydni Tahrirlash" : "Yangi Slayd Qo'shish"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Bosh sahifadagi karusel elementi
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-blue-900/30"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* IMAGE / BACKGROUND SECTION */}
              <div className="p-4 rounded-2xl bg-[#070e1c] border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Slayd Fon Rasmi (Image / Visual)
                  </label>

                  <div className="flex items-center rounded-lg bg-blue-950/60 p-0.5 border border-blue-800/40">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        imageMode === "upload"
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Fayl yuklash
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        imageMode === "url"
                          ? "bg-blue-600 text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      URL kiritish
                    </button>
                  </div>
                </div>

                {imageMode === "upload" ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-blue-950/80 border border-dashed border-blue-600/50 hover:border-blue-400 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <UploadCloud className="size-4.5" />
                      <span>{uploading ? "Yuklanmoqda..." : "Kompyuterdan rasm tanlash"}</span>
                    </button>

                    {imageUrl && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span className="truncate max-w-[200px]">{imageUrl}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0a1326] border border-blue-900/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                )}

                {/* Live Image Preview */}
                {imageUrl && (
                  <div className="relative h-28 w-full rounded-xl overflow-hidden border border-blue-800/40 bg-black/40">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-[11px] text-slate-300 font-mono">
                      Fon ko&apos;rinishi
                    </div>
                  </div>
                )}
              </div>

              {/* TITLES (UZ & RU) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sarlavha (O&apos;zbekcha) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brendingizni Raqamli Yetakchiga..."
                    value={titleUz}
                    onChange={(e) => setTitleUz(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sarlavha (Ruscha) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Выводим ваш бренд в лидеры..."
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* DESCRIPTIONS (UZ & RU) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tavsif (O&apos;zbekcha) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Maqsadli auditoriyani o'rganish, professional kontent..."
                    value={descUz}
                    onChange={(e) => setDescUz(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tavsif (Ruscha) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Глубокий анализ аудитории, профессиональный контент..."
                    value={descRu}
                    onChange={(e) => setDescRu(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* BADGES / CATEGORY (UZ & RU) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Badge / Kategoriya (UZ)
                  </label>
                  <input
                    type="text"
                    placeholder="Strategik SMM & Media"
                    value={badgeUz}
                    onChange={(e) => setBadgeUz(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Badge / Kategoriya (RU)
                  </label>
                  <input
                    type="text"
                    placeholder="Стратегический SMM и медиа"
                    value={badgeRu}
                    onChange={(e) => setBadgeRu(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SETTINGS: TARGET, ORDER, ACTIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-blue-900/20">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Yo&apos;nalish (Formaga mos)
                  </label>
                  <select
                    value={serviceTarget}
                    onChange={(e) => setServiceTarget(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="SMM">SMM</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT xizmatlari">IT xizmatlari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Ketma-ketlik (Tartib)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-[#070e1c] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="size-4.5 rounded border-blue-800 bg-[#070e1c] text-blue-600 focus:ring-blue-500"
                    />
                    <span>Saytda Faol</span>
                  </label>
                </div>
              </div>

              {/* BUTTON ACTIONS */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium hover:bg-blue-950/40 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {submitting ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
