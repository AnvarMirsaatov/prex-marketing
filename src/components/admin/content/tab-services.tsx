"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Service {
  id: string;
  slug: string;
  category: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

export function TabServices() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("SMM");
  const [titleUz, setTitleUz] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [descUz, setDescUz] = useState("");
  const [descRu, setDescRu] = useState("");
  const [icon, setIcon] = useState("Briefcase");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  async function fetchServices() {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (res.ok) {
        setServices(data.services);
      }
    } catch {
      showToast("Xizmatlarni yuklab bo'lmadi", "error");
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function openCreate() {
    setEditingId(null);
    setSlug("");
    setCategory("SMM");
    setTitleUz("");
    setTitleRu("");
    setDescUz("");
    setDescRu("");
    setIcon("Briefcase");
    setOrder("0");
    setIsActive(true);
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditingId(s.id);
    setSlug(s.slug);
    setCategory(s.category);
    setTitleUz(s.titleUz);
    setTitleRu(s.titleRu);
    setDescUz(s.descUz);
    setDescRu(s.descRu);
    setIcon(s.icon || "Briefcase");
    setOrder(String(s.order));
    setIsActive(s.isActive);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload = {
      id: editingId,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category,
      titleUz,
      titleRu,
      descUz,
      descRu,
      icon,
      order: Number(order) || 0,
      isActive,
    };

    try {
      const res = await fetch("/api/admin/services", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          editingId ? "Xizmat muvaffaqiyatli yangilandi" : "Yangi xizmat yaratildi",
          "success"
        );
        setModalOpen(false);
        fetchServices();
      } else {
        showToast("Xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xizmatni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Xizmat o'chirildi", "info");
        fetchServices();
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Xizmatlar (Services)</h1>
          <p className="text-sm text-slate-400">
            SMM, Kompleks Marketing va IT xizmatlari ro'yxati va tavsiflari
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer w-fit"
        >
          <Plus className="size-4" />
          <span>Yangi xizmat qo'shish</span>
        </button>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-[#0a1326] border border-blue-900/20 flex flex-col justify-between shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-950/80 text-sky-400 border border-blue-800/40">
                  {s.category}
                </span>
                <span className="text-xs font-mono text-slate-500">/{s.slug}</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{s.titleUz}</h3>
              <p className="text-xs text-sky-400/80 mb-3 font-medium">{s.titleRu}</p>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4">{s.descUz}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-blue-900/20">
              <span
                className={`text-xs font-semibold ${s.isActive ? "text-emerald-400" : "text-slate-500"}`}
              >
                {s.isActive ? "Faol" : "Nofaol"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Tahrirlash"
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="O'chirish"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Slug (URL manzili)
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="smm yoki it-development"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    <option value="SMM">SMM</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Sarlavha (UZ)
                </label>
                <input
                  type="text"
                  required
                  value={titleUz}
                  onChange={(e) => setTitleUz(e.target.value)}
                  placeholder="SMM (Social Media Marketing)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Sarlavha (RU)
                </label>
                <input
                  type="text"
                  required
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder="SMM (Маркетинг в соцсетях)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tavsif (UZ)
                </label>
                <textarea
                  rows={3}
                  required
                  value={descUz}
                  onChange={(e) => setDescUz(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tavsif (RU)
                </label>
                <textarea
                  rows={3}
                  required
                  value={descRu}
                  onChange={(e) => setDescRu(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Saytda faol ko'rsatilsin</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-900/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-300 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer"
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
