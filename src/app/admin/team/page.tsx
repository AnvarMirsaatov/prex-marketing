"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, UserCheck, X, Trash2, Edit2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Member {
  id: string;
  name: string;
  roleUz: string;
  roleRu: string;
  bioUz: string | null;
  bioRu: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminTeamPage() {
  const { showToast } = useToast();
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [roleUz, setRoleUz] = useState("");
  const [roleRu, setRoleRu] = useState("");
  const [bioUz, setBioUz] = useState("");
  const [bioRu, setBioRu] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (res.ok) setTeam(data.team);
    } catch {
      showToast("Jamoa a'zolarini yuklab bo'lmadi", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, []);

  function openCreate() {
    setEditingId(null);
    setName("");
    setRoleUz("");
    setRoleRu("");
    setBioUz("");
    setBioRu("");
    setImageUrl("");
    setIsActive(true);
    setModalOpen(true);
  }

  function openEdit(m: Member) {
    setEditingId(m.id);
    setName(m.name);
    setRoleUz(m.roleUz);
    setRoleRu(m.roleRu);
    setBioUz(m.bioUz || "");
    setBioRu(m.bioRu || "");
    setImageUrl(m.imageUrl || "");
    setIsActive(m.isActive);
    setModalOpen(true);
  }

  async function handleToggleActive(m: Member) {
    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...m,
          isActive: !m.isActive,
        }),
      });
      if (res.ok) {
        showToast(
          !m.isActive ? "Xodim saytda faollashtirildi" : "Xodim faolsizlantirildi",
          "success"
        );
        fetchTeam();
      }
    } catch {
      showToast("Xatolik yuz berdi", "error");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/team", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          roleUz,
          roleRu,
          bioUz: bioUz || null,
          bioRu: bioRu || null,
          imageUrl: imageUrl || null,
          isActive,
        }),
      });
      if (res.ok) {
        showToast(
          editingId ? "Jamoa a'zosi yangilandi" : "Jamoa a'zosi qo'shildi",
          "success"
        );
        setModalOpen(false);
        fetchTeam();
      } else {
        showToast("Saqlashda xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("A'zoni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("A'zo o'chirildi", "info");
        fetchTeam();
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Jamoa (Team)</h1>
          <p className="text-sm text-slate-400">
            Jamoa a'zolari moduli (kelajakda saytda faollashtirish imkoni bilan)
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer w-fit"
        >
          <Plus className="size-4" />
          <span>A'zo qo'shish</span>
        </button>
      </div>

      {loading && team.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-sky-400" />
          <p className="text-sm">Yuklanmoqda...</p>
        </div>
      ) : team.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0a1326] border border-blue-900/20 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-blue-950/80 text-sky-400 border border-blue-800/40 flex items-center justify-center mx-auto">
            <UserCheck className="size-6" />
          </div>
          <h3 className="font-bold text-white text-base">Jamoa a'zolari moduli tayyor</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Xodimlarni oldindan kiritib qo'yishingiz va kerakli vaqtda birgina tugma orqali saytda ko'rsatishingiz mumkin.
          </p>
          <button
            onClick={openCreate}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-950/80 hover:bg-blue-900/60 border border-blue-800/40 text-sky-200 text-xs font-semibold rounded-xl cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Birinchi xodimni qo'shish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 flex flex-col justify-between gap-4 hover:border-blue-500/30 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="size-12 rounded-xl object-cover border border-blue-800/40 shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-xl bg-blue-950/80 text-sky-300 font-black text-sm flex items-center justify-center shrink-0 border border-blue-800/40">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{m.name}</h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        m.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-blue-950/60 text-slate-400 border border-blue-900/40"
                      }`}
                    >
                      {m.isActive ? "Saytda faol" : "Yashirin"}
                    </span>
                  </div>
                  <p className="text-xs text-sky-400 mt-0.5 font-medium">{m.roleUz}</p>
                  <p className="text-xs text-slate-500">{m.roleRu}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleToggleActive(m)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    m.isActive
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title={m.isActive ? "Yashirish" : "Saytda faollashtirish"}
                >
                  {m.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  <span>{m.isActive ? "Faol" : "Nofaol"}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(m)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Xodimni tahrirlash" : "Jamoa a'zosini qo'shish"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ism familiyasi</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Sardor Alimov"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Lavozimi (UZ)</label>
                <input
                  type="text"
                  required
                  value={roleUz}
                  onChange={(e) => setRoleUz(e.target.value)}
                  placeholder="Targetolog / Marketing direktori"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Lavozimi (RU)</label>
                <input
                  type="text"
                  required
                  value={roleRu}
                  onChange={(e) => setRoleRu(e.target.value)}
                  placeholder="Таргетолог / Директор по маркетингу"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Foto (Fayl yuklash yoki URL)</label>
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
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/team/sardor.jpg yoki https://..."
                    className="w-full px-3.5 py-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2 p-2 bg-[#050b14] rounded-xl border border-blue-900/30 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Preview:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="size-8 rounded-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Qisqa bio (UZ, ixtiyoriy)</label>
                <textarea
                  rows={2}
                  value={bioUz}
                  onChange={(e) => setBioUz(e.target.value)}
                  placeholder="5 yillik tajriba..."
                  className="w-full p-2.5 bg-[#050b14] border border-blue-900/30 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="team-is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-4 rounded accent-blue-600"
                />
                <label htmlFor="team-is-active" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Saytda faol ko'rsatilsin
                </label>
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
