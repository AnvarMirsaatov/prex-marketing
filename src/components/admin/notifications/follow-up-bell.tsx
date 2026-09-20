"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Bell,
  BellRing,
  Phone,
  Clock,
  ExternalLink,
  RefreshCw,
  User,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowUpItem {
  id: string;
  name: string;
  phone: string;
  serviceType: string;
  status: string;
  followUpDate: string;
  followUpNote: string;
  followUpStatus: string;
  followUpSetByName: string | null;
  assignedTo: { id: string; name: string; username: string } | null;
}

interface NotificationData {
  dueCount: number;
  upcomingCount: number;
  totalPending: number;
  dueItems: FollowUpItem[];
  upcomingItems: FollowUpItem[];
  isSuperAdmin: boolean;
}

export function FollowUpBell() {
  const router = useRouter();
  const [data, setData] = useState<NotificationData>({
    dueCount: 0,
    upcomingCount: 0,
    totalPending: 0,
    dueItems: [],
    upcomingItems: [],
    isSuperAdmin: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"due" | "upcoming">("due");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [todayDateString, setTodayDateString] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications/follow-ups");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Notifications fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const d = new Date();
      setCurrentTime(d.getTime());
      setTodayDateString(d.toDateString());
    };
    updateTimes();
    fetchNotifications();

    // Har 60 soniyada avtomatik yangilash
    const interval = setInterval(() => {
      updateTimes();
      fetchNotifications();
    }, 60000);

    // Boshqa joyda follow-up yangilanganda darhol re-fetch qilish
    const handleUpdate = () => {
      updateTimes();
      fetchNotifications();
    };
    window.addEventListener("prox-followup-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("prox-followup-updated", handleUpdate);
    };
  }, [fetchNotifications]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function isOverdue(dateStr: string) {
    if (!currentTime) return false;
    return new Date(dateStr).getTime() < currentTime;
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    const isToday = todayDateString ? d.toDateString() === todayDateString : false;

    const timeString = d.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Bugun, ${timeString}`;
    }

    return `${d.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
    })}, ${timeString}`;
  }

  function handleOpenLead(leadId: string) {
    setIsOpen(false);
    router.push(`/admin/leads?highlight=${leadId}`);
  }

  const items = activeTab === "due" ? data.dueItems : data.upcomingItems;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Eslatmalar"
        className={`relative p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          data.dueCount > 0
            ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 shadow-lg shadow-amber-500/10"
            : "text-slate-400 hover:text-sky-200 hover:bg-blue-950/40 border border-blue-900/30"
        }`}
      >
        {data.dueCount > 0 ? (
          <BellRing className="size-5 animate-pulse text-amber-400" />
        ) : (
          <Bell className="size-5" />
        )}

        {/* Counter Badge */}
        {data.dueCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-[#070e1c] shadow-md animate-bounce">
            {data.dueCount > 99 ? "99+" : data.dueCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-84 sm:w-96 rounded-2xl bg-[#081022] border border-blue-900/40 shadow-2xl shadow-blue-950/90 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Dropdown Header */}
          <div className="p-3.5 bg-[#050b17] border-b border-blue-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                <Clock className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-tight">
                  Qayta bog'lanish eslatmalari
                </h4>
                <p className="text-[10px] text-slate-400">
                  {data.isSuperAdmin ? "Barcha menejerlar eslatmalari" : "Sizga biriktirilgan mijozlar"}
                </p>
              </div>
            </div>

            <button
              onClick={fetchNotifications}
              disabled={loading}
              title="Yangilash"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-blue-950/50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-sky-400" : ""}`} />
            </button>
          </div>

          {/* Tab buttons */}
          <div className="p-2 bg-[#060c1c] border-b border-blue-900/20 flex gap-1.5">
            <button
              onClick={() => setActiveTab("due")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "due"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Bugun & Kechikkan</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                data.dueCount > 0 ? "bg-rose-500 text-white" : "bg-blue-950 text-slate-400"
              }`}>
                {data.dueCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Kelgusi kunlar</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-950 text-slate-400">
                {data.upcomingCount}
              </span>
            </button>
          </div>

          {/* List Items */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-blue-900/20">
            {items.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1.5">
                <CheckCircle2 className="size-8 mx-auto text-emerald-400/80 mb-1" />
                <p className="text-xs font-semibold text-slate-300">
                  {activeTab === "due"
                    ? "Bugun uchun kutilayotgan qayta bog'lanishlar yo'q!"
                    : "Kelgusi eslatmalar mavjud emas"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {activeTab === "due"
                    ? "Barcha qo'ng'iroqlar o'z vaqtida bajarilgan 👍"
                    : "Lidlar bo'limidan yangi qayta bog'lanish belgilashingiz mumkin."}
                </p>
              </div>
            ) : (
              items.map((lead) => {
                const overdue = isOverdue(lead.followUpDate);
                return (
                  <div
                    key={lead.id}
                    className="p-3 hover:bg-blue-950/30 transition-colors space-y-2 group"
                  >
                    {/* Header line: name, badge, phone */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">
                            {lead.name || "Noma'lum"}
                          </span>
                          <span className="text-[10px] bg-blue-950 border border-blue-800/40 text-sky-300 px-1.5 py-0.2 rounded font-medium">
                            {lead.serviceType || "Umumiy"}
                          </span>
                        </div>

                        {/* Phone */}
                        <a
                          href={lead.phone ? `tel:${lead.phone}` : "#"}
                          className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-semibold hover:underline mt-0.5"
                        >
                          <Phone className="size-3" />
                          <span>{lead.phone || "—"}</span>
                        </a>
                      </div>

                      {/* Scheduled Time Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
                          overdue
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {overdue ? (
                          <>
                            <AlertTriangle className="size-3 text-rose-400" />
                            <span>Kechikkan</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-3 text-amber-400" />
                            <span>{formatTime(lead.followUpDate)}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Note Preview */}
                    <p className="text-[11px] text-slate-300 bg-[#050b14] p-2 rounded-lg border border-blue-900/30 line-clamp-2 leading-relaxed italic">
                      &ldquo;{lead.followUpNote}&rdquo;
                    </p>

                    {/* Meta info: Assigned Admin & Actions */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <div className="flex items-center gap-1 truncate max-w-[170px]">
                        <User className="size-3 text-slate-500 shrink-0" />
                        <span className="truncate">
                          {lead.assignedTo?.name || lead.followUpSetByName || "Admin"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenLead(lead.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
                      >
                        <span>Ko'rish</span>
                        <ExternalLink className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-2.5 bg-[#050b17] border-t border-blue-900/30 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/admin/leads?status=qayta_bog'lanish");
              }}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline cursor-pointer"
            >
              Barcha qayta bog'lanishlarni ko'rish &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
