"use client";

import { useEffect, useState, useMemo } from "react";
import { Phone, Trash2, Clock, RefreshCw, Search, X } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const query = searchQuery.toLowerCase().trim();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.serviceType.toLowerCase().includes(query) ||
        (lead.comment && lead.comment.toLowerCase().includes(query))
    );
  }, [leads, searchQuery]);

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
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900/20 pb-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
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
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 border border-blue-400/20 font-semibold"
                    : "bg-[#0a1326] text-slate-400 hover:bg-blue-950/40 hover:text-white border border-blue-900/20"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    active ? "bg-white/20 text-white" : tab.badgeClass || "bg-blue-950 text-slate-400 border border-blue-800/30"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[260px] max-w-sm w-full">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, raqam yoki xizmat..."
            className="w-full pl-9.5 pr-8 py-2 bg-[#0a1326] border border-blue-900/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Leads Table / Cards */}
      <div className="rounded-2xl bg-[#0a1326] border border-blue-900/20 overflow-hidden shadow-sm">
        {loading && leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-sky-400" />
            <p className="text-sm">So'rovlar yuklanmoqda...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            {searchQuery
              ? `"${searchQuery}" bo'yicha hech qanday so'rov topilmadi.`
              : "Ushbu filtr bo'yicha hech qanday so'rov topilmadi."}
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-blue-950/15 transition-colors"
              >
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base">{lead.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        lead.status === "yangi"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : lead.status === "ko'rildi"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {lead.status === "yopildi" ? "yakunlandi" : lead.status}
                    </span>
                    <span className="text-xs bg-blue-950/60 border border-blue-800/40 text-sky-300 px-2.5 py-0.5 rounded-md font-medium">
                      {lead.serviceType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center gap-1.5 text-sky-400 font-semibold hover:underline bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
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
                    <p className="text-xs text-slate-300 bg-[#050b14] p-3 rounded-xl border border-blue-900/20 mt-2">
                      <span className="text-slate-500 font-medium mr-1">Izoh:</span>
                      {lead.comment}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-[#050b14] p-1 rounded-xl border border-blue-900/30">
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
