"use client";

import { useEffect, useState, useCallback } from "react";
import {
  History,
  RefreshCw,
  Search,
  User,
  Clock,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface AuditLogItem {
  id: string;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  action: string;
  entity: string;
  details: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    username: string;
    role: string;
  } | null;
}

interface AdminOption {
  id: string;
  name: string;
  username: string;
  role: string;
}

const ENTITY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  Leads: {
    label: "So'rovlar (Leads)",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  Tariffs: {
    label: "Tariflar",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
  Hero: {
    label: "Hero Karusel",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    border: "border-sky-500/30",
  },
  Services: {
    label: "Xizmatlar",
    bg: "bg-blue-500/10",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  Settings: {
    label: "Sozlamalar",
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  Users: {
    label: "Adminlar",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
  Security: {
    label: "Xavfsizlik",
    bg: "bg-red-500/10",
    text: "text-red-300",
    border: "border-red-500/30",
  },
  Partners: {
    label: "Hamkorlar",
    bg: "bg-cyan-500/10",
    text: "text-cyan-300",
    border: "border-cyan-500/30",
  },
  Portfolio: {
    label: "Portfolio",
    bg: "bg-indigo-500/10",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
  },
  Team: {
    label: "Jamoa",
    bg: "bg-teal-500/10",
    text: "text-teal-300",
    border: "border-teal-500/30",
  },
};

export default function AuditLogPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [admins, setAdmins] = useState<AdminOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedAdmin, setSelectedAdmin] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch admin list for filter
  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/admin/admins");
        if (res.ok) {
          const data = await res.json();
          setAdmins(data.admins || []);
        }
      } catch (e) {
        console.error("Admins load error:", e);
      }
    }
    loadAdmins();
  }, []);

  const fetchLogs = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("limit", "40");
      if (selectedEntity !== "all") params.set("entity", selectedEntity);
      if (selectedAdmin !== "all") params.set("userId", selectedAdmin);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          showToast("Ushbu sahifaga faqat Super Admin kira oladi", "error");
          return;
        }
        throw new Error("Audit loglarini yuklab bo'lmadi");
      }

      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Xatolik yuz berdi";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, selectedEntity, selectedAdmin, searchQuery, showToast]);

  useEffect(() => {
    fetchLogs(1);
  }, [selectedEntity, selectedAdmin]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1);
  };

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <History className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Harakatlar tarixi (Audit Log)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold uppercase tracking-wider">
                  Faqat Super Admin
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Barcha adminlar tomonidan amalga oshirilgan harakatlar va o'zgarishlar jurnali
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchLogs(page)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Entity Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedEntity("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedEntity === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30"
                  : "bg-blue-950/40 text-slate-400 hover:text-white border border-blue-900/30"
              }`}
            >
              Barcha bo'limlar
            </button>
            {Object.entries(ENTITY_CONFIG).map(([key, cfg]) => {
              const active = selectedEntity === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedEntity(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30"
                      : "bg-[#070e1c] text-slate-400 hover:text-white border border-blue-900/30"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Admin Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <User className="size-4 text-slate-400" />
            <select
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              className="px-3 py-1.5 bg-[#070e1c] border border-blue-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
            >
              <option value="all">Barcha adminlar</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} (@{admin.username}) - {admin.role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Qidiruv: admin ismi, amal nomi yoki tafsilotlar bo'yicha..."
            className="w-full pl-9.5 pr-20 py-2.5 bg-[#070e1c] border border-blue-900/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                fetchLogs(1);
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Qidirish
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl bg-[#0a1326] border border-blue-900/20 overflow-hidden shadow-sm">
        {loading && logs.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <RefreshCw className="size-7 animate-spin mx-auto mb-3 text-sky-400" />
            <p className="text-sm">Harakatlar jurnali yuklanmoqda...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-slate-500 space-y-2">
            <Layers className="size-8 mx-auto text-slate-600" />
            <p className="text-base font-semibold text-slate-400">Hech qanday harakat topilmadi</p>
            <p className="text-xs text-slate-500">
              Tanlangan filtrlar yoki qidiruv so'rovi bo'yicha audit yozuvlari mavjud emas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-blue-900/30 bg-[#070e1c]/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Sana va Vaqt</th>
                  <th className="py-3.5 px-4">Admin</th>
                  <th className="py-3.5 px-4">Bo'lim</th>
                  <th className="py-3.5 px-4">Bajarilgan amal va tafsilotlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/15">
                {logs.map((log) => {
                  const cfg = ENTITY_CONFIG[log.entity] || {
                    label: log.entity,
                    bg: "bg-slate-500/10",
                    text: "text-slate-300",
                    border: "border-slate-500/30",
                  };
                  const isSuper = (log.userRole || log.user?.role || "").toUpperCase() === "SUPER_ADMIN";

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-blue-950/20 transition-colors"
                    >
                      {/* Date / Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                          <Clock className="size-3.5 text-blue-400 shrink-0" />
                          <span>
                            {new Date(log.createdAt).toLocaleDateString("uz-UZ", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 pl-5">
                          {new Date(log.createdAt).toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Admin */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                              isSuper
                                ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                                : "bg-sky-600/20 border-sky-500/40 text-sky-200"
                            }`}
                          >
                            {(log.userName || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white leading-tight">
                              {log.userName || log.user?.name || "Noma'lum admin"}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  isSuper
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                    : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                }`}
                              >
                                {isSuper ? "Super Admin" : "Menejer"}
                              </span>
                              {log.user?.username && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  @{log.user.username}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </td>

                      {/* Action & Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300 font-bold">
                              {log.action}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium leading-relaxed">
                            {log.details}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-blue-900/20 bg-[#070e1c]/40 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Jami <span className="text-white font-bold">{total}</span> ta yozuv (Sahifa {page} / {totalPages})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLogs(page - 1)}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0a1326] border border-blue-900/30 text-slate-300 hover:text-white hover:bg-blue-950/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Oldingi</span>
              </button>
              <button
                onClick={() => fetchLogs(page + 1)}
                disabled={page >= totalPages || loading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0a1326] border border-blue-900/30 text-slate-300 hover:text-white hover:bg-blue-950/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
              >
                <span>Keyingi</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
