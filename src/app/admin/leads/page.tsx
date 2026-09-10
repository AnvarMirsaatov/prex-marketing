"use client";

import { useEffect, useState } from "react";
import { Phone, Trash2, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface Lead {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  comment: string | null;
  status: string;
  source: string;
  createdAt: string;
}

interface Counts {
  all: number;
  yangi: number;
  korildi: number;
  yakunlandi: number;
}

export default function AdminLeadsPage() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, yangi: 0, korildi: 0, yakunlandi: 0 });
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");

  async function fetchLeads(status = activeStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?status=${status}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
        setCounts(data.counts);
      } else {
        showToast(data.error || "Xatolik yuz berdi", "error");
      }
    } catch {
      showToast("So'rovlarni yuklab bo'lmadi", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads(activeStatus);
  }, [activeStatus]);

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        showToast("Status muvaffaqiyatli o'zgartirildi", "success");
        fetchLeads(activeStatus);
      } else {
        showToast("Statusni o'zgartirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Haqiqatan ham bu so'rovni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("So'rov o'chirildi", "info");
        fetchLeads(activeStatus);
      } else {
        showToast("O'chirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">So'rovlar (Leads)</h1>
          <p className="text-sm text-slate-400">
            Mijozlardan kelib tushgan konsultatsiya va xizmat buyurtmalari
          </p>
        </div>
        <button
          onClick={() => fetchLeads()}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { key: "all", label: "Barchasi", count: counts.all },
          { key: "yangi", label: "Yangi", count: counts.yangi, badgeClass: "bg-amber-500/20 text-amber-300" },
          { key: "ko'rildi", label: "Ko'rildi", count: counts.korildi, badgeClass: "bg-blue-500/20 text-blue-300" },
          { key: "yakunlandi", label: "Yakunlandi", count: counts.yakunlandi, badgeClass: "bg-emerald-500/20 text-emerald-300" },
        ].map((tab) => {
          const active = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  active ? "bg-white/20 text-white" : tab.badgeClass || "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leads Table / Cards */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading && leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-purple-400" />
            <p className="text-sm">So'rovlar yuklanmoqda...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Ushbu filtr bo'yicha hech qanday so'rov topilmadi.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/40 transition-colors"
              >
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base">{lead.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        lead.status === "yangi"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : lead.status === "ko'rildi"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {lead.status === "yopildi" ? "yakunlandi" : lead.status}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-medium">
                      {lead.serviceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-1.5 text-purple-400 font-semibold hover:underline bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
                    >
                      <Phone className="size-3.5" />
                      {lead.phone}
                    </a>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="size-3.5" />
                      {new Date(lead.createdAt).toLocaleString("uz-UZ", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {lead.comment && (
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mt-2">
                      <span className="text-slate-500 font-medium mr-1">Izoh:</span>
                      {lead.comment}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleStatusChange(lead.id, "yangi")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        lead.status === "yangi"
                          ? "bg-amber-500 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Yangi
                    </button>
                    <button
                      onClick={() => handleStatusChange(lead.id, "ko'rildi")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        lead.status === "ko'rildi"
                          ? "bg-blue-500 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Ko'rildi
                    </button>
                    <button
                      onClick={() => handleStatusChange(lead.id, "yakunlandi")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        lead.status === "yakunlandi" || lead.status === "yopildi"
                          ? "bg-emerald-500 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Yakunlandi
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
