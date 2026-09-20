"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface PortfolioItem {
  id: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  imageUrl: string;
  category: string;
  clientName: string | null;
  projectUrl: string | null;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
}

export default function AdminPortfolioPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleUz, setTitleUz] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descUz, setDescUz] = useState("");
  const [descRu, setDescRu] = useState("");
  const [imageUrl, setImageUrl] = useState("/portfolio/sample.jpg");
  const [category, setCategory] = useState("SMM");
  const [clientName, setClientName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  async function fetchPortfolio() {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (res.ok) setItems(data.portfolio);
    } catch {
      showToast("Portfolioni yuklab bo'lmadi", "error");
    }
  }

  useEffect(() => {
    fetchPortfolio();
  }, []);

  function openCreate() {
    setEditingId(null);
    setTitleUz("");
    setTitleRu("");
    setDescUz("");
    setDescRu("");
    setImageUrl("/portfolio/sample.jpg");
    setCategory("SMM");
    setClientName("");
    setProjectUrl("");
    setIsFeatured(false);
    setModalOpen(true);
  }

  function openEdit(it: PortfolioItem) {
    setEditingId(it.id);
    setTitleUz(it.titleUz);
    setTitleRu(it.titleRu);
    setDescUz(it.descUz);
    setDescRu(it.descRu);
    setImageUrl(it.imageUrl);
    setCategory(it.category);
    setClientName(it.clientName || "");
    setProjectUrl(it.projectUrl || "");
    setIsFeatured(it.isFeatured);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          titleUz,
          titleRu,
          descUz,
          descRu,
          imageUrl,
          category,
          clientName: clientName || null,
          projectUrl: projectUrl || null,
          isFeatured,
          order: 0,
          isActive: true,
        }),
      });

      if (res.ok) {
        showToast(editingId ? "Keys yangilandi" : "Yangi keys qo'shildi", "success");
        setModalOpen(false);
        fetchPortfolio();
      } else {
        showToast("Xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Keysni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Keys o'chirildi", "info");
        fetchPortfolio();
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Portfolio / Keyslar</h1>
          <p className="text-sm text-slate-400">
            Muvaffaqiyatli loyihalar va keyslar (TZ talabi bo'yicha tayyor bo'sh modul)
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer w-fit"
        >
          <Plus className="size-4" />
          <span>Yangi keys qo'shish</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0a1326] border border-blue-900/20 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-blue-950/80 text-sky-400 border border-blue-800/40 flex items-center justify-center mx-auto">
            <ImageIcon className="size-6" />
          </div>
          <h3 className="font-bold text-white text-base">Portfolio hozircha bo'sh holatda</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            TZ'ning 11-bandiga muvofiq, portfolio bo'limi dastlabki bosqichda bo'sh ishga tushiriladi va
            istalgan vaqtda ushbu admin panel orqali to'ldiriladi.
          </p>
          <button
            onClick={openCreate}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-950/80 hover:bg-blue-900/60 border border-blue-800/40 text-sky-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Birinchi keysni qo'shish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl bg-[#0a1326] border border-blue-900/20 overflow-hidden shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-all"
            >
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-sky-300 border border-blue-800/40">
                  {it.category}
                </span>
                <h3 className="font-bold text-white text-base mt-2">{it.titleUz}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{it.descUz}</p>
              </div>

              <div className="p-4 bg-[#050b14] border-t border-blue-900/20 flex items-center justify-between">
                <span className="text-xs text-slate-500">{it.clientName || "Mijoz ko'rsatilmagan"}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(it)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Keysni tahrirlash" : "Yangi keys qo'shish"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sarlavha (UZ)</label>
                  <input
                    type="text"
                    required
                    value={titleUz}
                    onChange={(e) => setTitleUz(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Sarlavha (RU)</label>
                  <input
                    type="text"
                    required
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Kategoriya</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    <option value="SMM">SMM</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Mijoz / Brend nomi</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Masalan: Safia Cafe"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Loyiha havolasi (ixtiyoriy)</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tavsif (UZ)</label>
                <textarea
                  rows={2}
                  required
                  value={descUz}
                  onChange={(e) => setDescUz(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tavsif (RU)</label>
                <textarea
                  rows={2}
                  required
                  value={descRu}
                  onChange={(e) => setDescRu(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Rasm (Fayl yuklash yoki URL)</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === "string") {
                            setImageUrl(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/portfolio/sample.jpg yoki https://..."
                    className="w-full px-3 py-2 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2 p-2 bg-[#050b14] rounded-xl border border-blue-900/30 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Preview:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="h-10 w-16 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-300 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
