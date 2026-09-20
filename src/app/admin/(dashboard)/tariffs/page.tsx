"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Tariff {
  id: string;
  nameUz: string;
  nameRu: string;
  serviceType: string;
  price: string;
  periodUz: string;
  periodRu: string;
  durationMonths: number | null;
  featuresUz: string;
  featuresRu: string;
  isPopular: boolean;
  order: number;
  isActive: boolean;
}

export default function AdminTariffsPage() {
  const { showToast } = useToast();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [nameUz, setNameUz] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [serviceType, setServiceType] = useState("SMM");
  const [price, setPrice] = useState("");
  const [periodUz, setPeriodUz] = useState("/ oy");
  const [periodRu, setPeriodRu] = useState("/ месяц");
  const [durationMonths, setDurationMonths] = useState<string>("");
  const [featuresUzText, setFeaturesUzText] = useState("");
  const [featuresRuText, setFeaturesRuText] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  async function fetchTariffs() {
    try {
      const res = await fetch("/api/admin/tariffs");
      const data = await res.json();
      if (res.ok) {
        setTariffs(data.tariffs);
      }
    } catch {
      showToast("Tariflarni yuklab bo'lmadi", "error");
    }
  }

  useEffect(() => {
    fetchTariffs();
  }, []);

  function openCreate() {
    setEditingId(null);
    setNameUz("");
    setNameRu("");
    setServiceType("SMM");
    setPrice("");
    setPeriodUz("/ oy");
    setPeriodRu("/ месяц");
    setDurationMonths("");
    setFeaturesUzText("");
    setFeaturesRuText("");
    setIsPopular(false);
    setOrder("0");
    setIsActive(true);
    setModalOpen(true);
  }

  function openEdit(t: Tariff) {
    setEditingId(t.id);
    setNameUz(t.nameUz);
    setNameRu(t.nameRu);
    setServiceType(t.serviceType);
    setPrice(t.price);
    setPeriodUz(t.periodUz);
    setPeriodRu(t.periodRu);
    setDurationMonths(t.durationMonths ? String(t.durationMonths) : "");

    try {
      const parsedUz = JSON.parse(t.featuresUz);
      setFeaturesUzText(Array.isArray(parsedUz) ? parsedUz.join("\n") : t.featuresUz);
    } catch {
      setFeaturesUzText(t.featuresUz);
    }

    try {
      const parsedRu = JSON.parse(t.featuresRu);
      setFeaturesRuText(Array.isArray(parsedRu) ? parsedRu.join("\n") : t.featuresRu);
    } catch {
      setFeaturesRuText(t.featuresRu);
    }

    setIsPopular(t.isPopular);
    setOrder(String(t.order));
    setIsActive(t.isActive);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const featuresUz = featuresUzText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const featuresRu = featuresRuText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: editingId,
      nameUz,
      nameRu,
      serviceType,
      price,
      periodUz,
      periodRu,
      durationMonths: durationMonths ? Number(durationMonths) : null,
      featuresUz: JSON.stringify(featuresUz),
      featuresRu: JSON.stringify(featuresRu),
      isPopular,
      order: Number(order) || 0,
      isActive,
    };

    try {
      const res = await fetch("/api/admin/tariffs", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          editingId ? "Tarif muvaffaqiyatli yangilandi" : "Yangi tarif yaratildi",
          "success"
        );
        setModalOpen(false);
        fetchTariffs();
      } else {
        showToast("Xatolik yuz berdi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tarifni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/tariffs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Tarif o'chirildi", "info");
        fetchTariffs();
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Tariflar (Narxlar)</h1>
          <p className="text-sm text-slate-400">
            SMM, Marketing va IT xizmatlari paketlari hamda oylik narxlarini boshqarish
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20 cursor-pointer w-fit"
        >
          <Plus className="size-4" />
          <span>Yangi tarif qo'shish</span>
        </button>
      </div>

      {/* Tariffs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tariffs.map((t) => {
          let features: string[] = [];
          try {
            features = JSON.parse(t.featuresUz);
          } catch {
            features = [];
          }

          return (
            <div
              key={t.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                t.isPopular
                  ? "bg-[#0a1326] border-blue-500/50 shadow-xl shadow-blue-950/40"
                  : "bg-[#0a1326] border-blue-900/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-950/80 text-sky-400 border border-blue-800/40">
                    {t.serviceType}
                  </span>
                  {t.isPopular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                      Ommabop
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mt-2">{t.nameUz}</h3>
                <p className="text-xs text-slate-400">{t.nameRu}</p>

                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{t.price}</span>
                  <span className="text-xs text-slate-400">{t.periodUz}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="size-3.5 text-lime-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {features.length > 4 && (
                    <li className="text-[11px] text-slate-500 italic pl-5">
                      +{features.length - 4} ta boshqa xususiyatlar
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span
                  className={`text-xs font-semibold ${t.isActive ? "text-emerald-400" : "text-slate-500"}`}
                >
                  {t.isActive ? "Faol" : "Nofaol"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Tarifni tahrirlash" : "Yangi tarif yaratish"}
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
                    Nomi (O'zbekcha)
                  </label>
                  <input
                    type="text"
                    required
                    value={nameUz}
                    onChange={(e) => setNameUz(e.target.value)}
                    placeholder="SMM — 3 oylik"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nomi (Ruscha)
                  </label>
                  <input
                    type="text"
                    required
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="SMM — 3 месяца"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Xizmat turi
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  >
                    <option value="SMM">SMM</option>
                    <option value="Marketing">Marketing</option>
                    <option value="IT">IT xizmatlari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Narxi</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$1500"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Muddat</label>
                  <input
                    type="text"
                    value={periodUz}
                    onChange={(e) => setPeriodUz(e.target.value)}
                    placeholder="/ oy"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Afzalliklari (UZ — har bir qatorda bittadan)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresUzText}
                    onChange={(e) => setFeaturesUzText(e.target.value)}
                    placeholder="Muntazam postlar&#10;Target reklama&#10;Oylik hisobot"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Afzalliklari (RU — har bir qatorda bittadan)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresRuText}
                    onChange={(e) => setFeaturesRuText(e.target.value)}
                    placeholder="Регулярные посты&#10;Таргет реклама&#10;Ежемесячный отчет"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Ommabop paket (Belgilash)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded accent-blue-600"
                  />
                  <span>Saytda ko'rsatish (Faol)</span>
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
