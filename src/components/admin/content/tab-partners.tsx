"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  order: number;
  isActive: boolean;
}

export function TabPartners() {
  const { showToast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  async function fetchPartners() {
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      if (res.ok) setPartners(data.partners);
    } catch {
      showToast("Hamkorlarni yuklab bo'lmadi", "error");
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  function openCreate() {
    setEditingId(null);
    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
    setOrder("0");
    setIsActive(true);
    setModalOpen(true);
  }

  function openEdit(p: Partner) {
    setEditingId(p.id);
    setName(p.name);
    setLogoUrl(p.logoUrl);
    setWebsiteUrl(p.websiteUrl || "");
    setOrder(String(p.order));
    setIsActive(p.isActive);
    setModalOpen(true);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setLogoUrl(data.url);
        showToast('Logotip yuklandi', 'success');
      } else {
        showToast(data.error || 'Yuklashda xatolik', 'error');
      }
    } catch {
      showToast('Server xatosi', 'error');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/partners", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          logoUrl,
          websiteUrl,
          order: Number(order) || 0,
          isActive,
        }),
      });

      if (res.ok) {
        showToast(editingId ? "Hamkor yangilandi" : "Yangi hamkor qo'shildi", "success");
        setModalOpen(false);
        fetchPartners();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hamkorni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Hamkor o'chirildi", "info");
        fetchPartners();
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Hamkorlar</h1>
          <p className="text-sm text-slate-400">
            Saytda ko'rsatiladigan mijozlar va brendlar logotiplari
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer w-fit"
        >
          <Plus className="size-4" />
          <span>Yangi hamkor qo'shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 flex items-center justify-between shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div>
              <h3 className="font-bold text-white text-base">{p.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{p.logoUrl}</p>
              {p.websiteUrl && (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  className="text-xs text-sky-400 hover:underline mt-1 block"
                >
                  {p.websiteUrl}
                </a>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openEdit(p)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="size-3.5" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Hamkorni tahrirlash" : "Yangi hamkor qo'shish"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Kompaniya nomi</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Logotip (Fayl yuklash yoki URL)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />
                    {uploadingLogo && (
                      <span className="text-xs text-slate-400 animate-pulse">Yuklanmoqda...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/uploads/your-logo.png yoki https://..."
                    className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                {logoUrl && (
                  <div className="mt-2 p-2 bg-[#050b14] rounded-xl border border-blue-900/30 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Preview:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt="Preview" className="h-6 max-w-[100px] object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Veb-sayt (ixtiyoriy)</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.uz"
                  className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm"
                />
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
                  disabled={submitting || uploadingLogo}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saqlanmoqda..." : uploadingLogo ? "Yuklanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
