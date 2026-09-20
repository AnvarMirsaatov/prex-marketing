"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Phone,
  Trash2,
  Clock,
  RefreshCw,
  Search,
  X,
  UserCheck,
  UserPlus,
  MessageSquare,
  Send,
  Edit3,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

interface AdminSummary {
  id?: string;
  userId?: string;
  name: string;
  username: string;
  role: string;
}

interface LeadNote {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  comment: string | null;
  status: string;
  source: string;
  assignedToId: string | null;
  assignedTo: AdminSummary | null;
  lastActionById: string | null;
  lastActionBy: AdminSummary | null;
  lastActionAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Counts {
  all: number;
  yangi: number;
  korildi: number;
  yakunlandi: number;
  mine: number;
  unassigned: number;
}

export default function AdminLeadsPage() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminSummary | null>(null);
  const [counts, setCounts] = useState<Counts>({
    all: 0,
    yangi: 0,
    korildi: 0,
    yakunlandi: 0,
    mine: 0,
    unassigned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [activeAssigned, setActiveAssigned] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Notes Modal state
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Load list of all admins
  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/admin/admins");
        if (res.ok) {
          const data = await res.json();
          setAdmins(data.admins || []);
          if (data.currentUser) {
            setCurrentUser(data.currentUser);
          }
        }
      } catch (e) {
        console.error("Admins load error:", e);
      }
    }
    loadAdmins();
  }, []);

  const fetchLeads = useCallback(
    async (status = activeStatus, assigned = activeAssigned) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (status !== "all") params.set("status", status);
        if (assigned !== "all") params.set("assigned", assigned);

        const res = await fetch(`/api/admin/leads?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setLeads(data.leads || []);
          setCounts(data.counts || { all: 0, yangi: 0, korildi: 0, yakunlandi: 0, mine: 0, unassigned: 0 });
          if (data.currentUser) {
            setCurrentUser(data.currentUser);
          }
        } else {
          showToast(data.error || "Xatolik yuz berdi", "error");
        }
      } catch {
        showToast("So'rovlarni yuklab bo'lmadi", "error");
      } finally {
        setLoading(false);
      }
    },
    [activeStatus, activeAssigned, showToast]
  );

  useEffect(() => {
    fetchLeads(activeStatus, activeAssigned);
  }, [activeStatus, activeAssigned, fetchLeads]);

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const query = searchQuery.toLowerCase().trim();
    return leads.filter(
      (lead) =>
        (lead.name || "").toLowerCase().includes(query) ||
        (lead.phone || "").toLowerCase().includes(query) ||
        (lead.serviceType || "").toLowerCase().includes(query) ||
        (lead.comment && lead.comment.toLowerCase().includes(query)) ||
        (lead.assignedTo && (lead.assignedTo.name || "").toLowerCase().includes(query))
    );
  }, [leads, searchQuery]);

  async function handleStatusChange(id: string, newStatus: string) {
    if (updatingLeadId) return;
    setUpdatingLeadId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Status muvaffaqiyatli o'zgartirildi", "success");
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? data.lead : l))
        );
        fetchLeads(activeStatus, activeAssigned);
      } else {
        showToast(data.error || "Statusni o'zgartirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  async function handleAssign(id: string, assignedToId: string | null) {
    if (updatingLeadId) return;
    setUpdatingLeadId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, assignedToId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(
          assignedToId ? "Lid adminga muvaffaqiyatli biriktirildi" : "Biriktiruv bekor qilindi",
          "success"
        );
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? data.lead : l))
        );
        fetchLeads(activeStatus, activeAssigned);
      } else {
        showToast(data.error || "Biriktirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!notesLead || !newNoteText.trim() || isSubmittingNote) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notesLead.id, note: newNoteText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Izoh saqlandi", "success");
        setNewNoteText("");
        setNotesLead(data.lead);
        setLeads((prev) =>
          prev.map((l) => (l.id === data.lead.id ? data.lead : l))
        );
      } else {
        showToast(data.error || "Izohni saqlab bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setIsSubmittingNote(false);
    }
  }

  async function handleDelete(id: string) {
    if (!isSuperAdmin) {
      showToast("Faqat Super Admin so'rovni o'chira oladi", "error");
      return;
    }
    if (!confirm("Haqiqatan ham bu so'rovni o'chirmoqchimisiz?")) return;
    if (updatingLeadId) return;
    setUpdatingLeadId(id);
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("So'rov o'chirildi", "info");
        fetchLeads(activeStatus, activeAssigned);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "O'chirib bo'lmadi", "error");
      }
    } catch {
      showToast("Server xatosi", "error");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  const isSuperAdmin = (currentUser?.role || "").toUpperCase() === "SUPER_ADMIN";

  function parseNotes(notesStr: string | null): LeadNote[] {
    if (!notesStr) return [];
    try {
      const parsed = JSON.parse(notesStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>So'rovlar (Leads)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/30 font-semibold">
              CRM Tizimi
            </span>
          </h1>
          <p className="text-sm text-slate-400">
            Kelib tushgan arizalar, mas'ul adminlar biriktiruvi va ichki ish tarixi
          </p>
        </div>
        <button
          onClick={() => fetchLeads(activeStatus, activeAssigned)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin text-sky-400" : ""}`} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1326] border border-blue-900/30 space-y-4">
        {/* Status & Assigned Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-blue-900/20 pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full pb-1">
            {[
              { key: "all", label: "Barcha arizalar", count: counts.all },
              { key: "yangi", label: "Yangi", count: counts.yangi, badgeClass: "bg-amber-500/20 text-amber-300" },
              { key: "ko'rildi", label: "Ko'rildi", count: counts.korildi, badgeClass: "bg-blue-500/20 text-blue-300" },
              { key: "yakunlandi", label: "Yakunlandi", count: counts.yakunlandi, badgeClass: "bg-emerald-500/20 text-emerald-300" },
            ].map((tab) => {
              const active = activeStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStatus(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[38px] transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30 border border-blue-400/20 font-bold"
                      : "bg-[#070e1c] text-slate-400 hover:bg-blue-950/40 hover:text-white border border-blue-900/30"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      active ? "bg-white/25 text-white" : tab.badgeClass || "bg-blue-950 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Assigned Filter Pills */}
          <div className="flex items-center gap-1 bg-[#070e1c] p-1 rounded-xl border border-blue-900/30 text-xs overflow-x-auto scrollbar-none max-w-full shrink-0">
            <button
              onClick={() => setActiveAssigned("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap min-h-[34px] transition-colors cursor-pointer ${
                activeAssigned === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Hammasi
            </button>
            <button
              onClick={() => setActiveAssigned("mine")}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap min-h-[34px] transition-colors cursor-pointer flex items-center gap-1 ${
                activeAssigned === "mine" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="size-3" />
              <span>Menga biriktirilgan ({counts.mine})</span>
            </button>
            <button
              onClick={() => setActiveAssigned("unassigned")}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap min-h-[34px] transition-colors cursor-pointer ${
                activeAssigned === "unassigned" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Biriktirilmagan ({counts.unassigned})
            </button>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mijoz ismi, telefon raqami, xizmat turi yoki mas'ul admin bo'yicha qidirish..."
            className="w-full pl-9.5 pr-8 py-2.5 bg-[#070e1c] border border-blue-900/30 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
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
          <div className="p-16 text-center text-slate-500">
            <RefreshCw className="size-7 animate-spin mx-auto mb-2 text-sky-400" />
            <p className="text-sm">So'rovlar yuklanmoqda...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm space-y-1">
            <p className="font-semibold text-slate-400">Hech qanday so'rov topilmadi</p>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? `"${searchQuery}" bo'yicha ma'lumot yo'q`
                : "Ushbu parametrlar bo'yicha lidlar mavjud emas"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {filteredLeads.map((lead) => {
              const notesList = parseNotes(lead.notes);
              const currentAdminId = currentUser?.userId || currentUser?.id;
              const isAssignedToMe = currentAdminId ? lead.assignedToId === currentAdminId : false;
              const isUpdating = updatingLeadId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 hover:bg-blue-950/15 transition-colors"
                >
                  {/* Info Column */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-bold text-white text-base tracking-tight">
                        {lead.name || "Noma'lum mijoz"}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          lead.status === "yangi"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : lead.status === "ko'rildi"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {lead.status === "yopildi" ? "yakunlandi" : lead.status || "yangi"}
                      </span>
                      <span className="text-xs bg-blue-950/70 border border-blue-800/40 text-sky-300 px-2.5 py-0.5 rounded-md font-medium">
                        {lead.serviceType || "Umumiy"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <a
                        href={lead.phone ? `tel:${lead.phone}` : "#"}
                        className="flex items-center gap-1.5 text-sky-400 font-semibold hover:underline bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                      >
                        <Phone className="size-3.5" />
                        {lead.phone || "—"}
                      </a>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="size-3.5 text-slate-500" />
                        {new Date(lead.createdAt).toLocaleString("uz-UZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Mas'ul admin & Oxirgi tahrir info bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {/* Mas'ul Admin Dropdown / Button */}
                      <div className="flex items-center gap-1.5 bg-[#050b14] px-3 py-1.5 rounded-xl border border-blue-900/30">
                        <span className="text-slate-400 font-medium text-[11px]">Mas'ul admin:</span>
                        {isSuperAdmin ? (
                          <select
                            disabled={isUpdating}
                            value={lead.assignedToId || ""}
                            onChange={(e) => handleAssign(lead.id, e.target.value || null)}
                            className="bg-transparent text-xs font-semibold text-sky-300 focus:outline-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="" className="bg-[#0a1326] text-slate-400">
                              Biriktirilmagan
                            </option>
                            {admins.map((admin) => (
                              <option
                                key={admin.id}
                                value={admin.id}
                                className="bg-[#0a1326] text-white"
                              >
                                {admin.name || admin.username} ({admin.role === "SUPER_ADMIN" ? "Super Admin" : "Menejer"})
                              </option>
                            ))}
                          </select>
                        ) : isAssignedToMe ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" /> Sizga biriktirilgan
                            </span>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleAssign(lead.id, null)}
                              className="text-[10px] text-slate-400 hover:text-rose-400 underline cursor-pointer disabled:opacity-50"
                            >
                              Bekor qilish
                            </button>
                          </div>
                        ) : lead.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sky-300 font-semibold">{lead.assignedTo.name || "Menejer"}</span>
                            <button
                              disabled={isUpdating}
                              onClick={() => handleAssign(lead.id, currentAdminId || null)}
                              className="text-[10px] text-sky-400 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              O'zimga olish
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleAssign(lead.id, currentAdminId || null)}
                            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold text-xs cursor-pointer hover:underline disabled:opacity-50"
                          >
                            <UserPlus className="size-3" />
                            O'zimga biriktirish
                          </button>
                        )}
                      </div>

                      {/* Oxirgi tahrir info */}
                      {lead.lastActionBy && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#050b14]/60 px-3 py-1.5 rounded-xl border border-blue-900/20">
                          <Edit3 className="size-3 text-sky-400" />
                          <span>
                            Oxirgi tahrir: <strong className="text-slate-200">{lead.lastActionBy.name || "Admin"}</strong> tomonidan{" "}
                            {new Date(lead.lastActionAt || lead.updatedAt).toLocaleString("uz-UZ", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Website comment */}
                    {lead.comment && (
                      <p className="text-xs text-slate-300 bg-[#050b14] p-2.5 rounded-xl border border-blue-900/20 mt-1 max-w-2xl break-words">
                        <span className="text-slate-500 font-semibold mr-1.5">Mijoz arizasi:</span>
                        {lead.comment}
                      </p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {/* Notes Trigger Button */}
                    <button
                      onClick={() => {
                        setNotesLead(lead);
                        setNewNoteText("");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-blue-950/50 hover:bg-blue-900/50 border border-blue-800/40 text-xs font-semibold text-sky-300 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="size-3.5" />
                      <span>Ichki izohlar ({notesList.length})</span>
                    </button>

                    {/* Status Pill Switcher */}
                    <div className="flex items-center gap-1 bg-[#050b14] p-1 rounded-xl border border-blue-900/30">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(lead.id, "yangi")}
                        className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                          lead.status === "yangi"
                            ? "bg-amber-500 text-slate-950 shadow font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Yangi
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(lead.id, "ko'rildi")}
                        className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                          lead.status === "ko'rildi"
                            ? "bg-blue-500 text-white shadow font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Ko'rildi
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(lead.id, "yakunlandi")}
                        className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                          lead.status === "yakunlandi" || lead.status === "yopildi"
                            ? "bg-emerald-500 text-slate-950 shadow font-bold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Yakunlandi
                      </button>
                    </div>

                    {/* Delete (SUPER_ADMIN only) */}
                    {isSuperAdmin && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="O'chirish (Super Admin)"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Internal Notes & History Modal */}
      {notesLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1326] border border-blue-900/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-blue-900/30 flex items-center justify-between bg-[#070e1c]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="size-4 text-sky-400" />
                  <span>Ichki izohlar va mijoz tarixi</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mijoz: <span className="text-white font-semibold">{notesLead.name || "Noma'lum"}</span> ({notesLead.phone || "—"})
                </p>
              </div>
              <button
                onClick={() => setNotesLead(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body: Feed of notes */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {parseNotes(notesLead.notes).length === 0 ? (
                <div className="text-center py-8 text-slate-500 space-y-1">
                  <MessageSquare className="size-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Hozircha ichki izohlar mavjud emas</p>
                  <p className="text-[11px] text-slate-500">
                    Mijoz bilan muzokara natijasi yoki eslatmani pastdagi formaga yozing.
                  </p>
                </div>
              ) : (
                parseNotes(notesLead.notes).map((note) => {
                  const isSuper = (note.authorRole || "").toUpperCase() === "SUPER_ADMIN";
                  return (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-[#070e1c] border border-blue-900/30 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{note.authorName || "Admin"}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              isSuper
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            }`}
                          >
                            {isSuper ? "Super Admin" : "Menejer"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.createdAt).toLocaleString("uz-UZ", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer: Add Note Form */}
            <form onSubmit={handleAddNote} className="p-4 border-t border-blue-900/30 bg-[#070e1c]">
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Masalan: Mijoz bilan 16:00 da gaplashdim, ertaga qayta qo'ng'iroq kutmoqda..."
                  className="w-full p-2.5 bg-[#0a1326] border border-blue-900/40 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 resize-none transition-all"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Izohlar faqat adminlar orasida ko'rinadi
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNoteText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Send className="size-3" />
                    <span>{isSubmittingNote ? "Saqlanmoqda..." : "Yozib qoldirish"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
