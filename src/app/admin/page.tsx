import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Inbox, Briefcase, Tags, ArrowUpRight, Phone, Clock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalLeads, newLeads, servicesCount, tariffsCount, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "yangi" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.tariff.count({ where: { isActive: true } }),
    prisma.lead.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8 pt-12 md:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Prox Marketing Agency — loyihalar, so'rovlar va kontent statistikasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 border border-blue-400/20"
          >
            <Inbox className="size-4" />
            <span>Barcha so'rovlar</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Yangi so'rovlar
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{newLeads}</span>
            <span className="text-xs text-slate-500">ta ko'rilmagan</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Jami so'rovlar
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-sky-400 border border-blue-500/20">
              <Inbox className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalLeads}</span>
            <span className="text-xs text-slate-500">ta lead</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Faol xizmatlar
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{servicesCount}</span>
            <span className="text-xs text-slate-500">ta xizmat</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tarif paketlari
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Tags className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{tariffsCount}</span>
            <span className="text-xs text-slate-500">ta paket</span>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="rounded-2xl bg-[#0a1326] border border-blue-900/20 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-blue-900/20 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Oxirgi kelib tushgan so'rovlar</h2>
            <p className="text-xs text-slate-400">Sayt orqali yuborilgan yangi mijozlar</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Hozircha hech qanday so'rov kelib tushmagan. Saytdagi forma orqali yuborilgan so'rovlar shu yerda paydo bo'ladi.
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-blue-950/20 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-950 border border-blue-800/40 flex items-center justify-center text-sky-300 font-bold shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{lead.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          lead.status === "yangi"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : lead.status === "ko'rildi"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1 text-sky-400 hover:underline"
                      >
                        <Phone className="size-3" />
                        {lead.phone}
                      </a>
                      <span>&bull;</span>
                      <span className="text-slate-300">{lead.serviceType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(lead.createdAt).toLocaleDateString("uz-UZ", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Link
                    href={`/admin/leads?id=${lead.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/50 border border-blue-800/40 text-slate-200 font-medium transition-colors"
                  >
                    Batafsil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/tariffs"
          className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 hover:border-blue-500/40 transition-all group shadow-sm hover:shadow-blue-950/40"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-sky-400 transition-colors">
              Tarif narxlarini boshqarish
            </span>
            <ArrowUpRight className="size-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            SMM va marketing xizmatlari narxlarini, oylik to'lovlarini tahrirlash
          </p>
        </Link>

        <Link
          href="/admin/services"
          className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 hover:border-blue-500/40 transition-all group shadow-sm hover:shadow-blue-950/40"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-sky-400 transition-colors">
              Xizmatlarni yangilash
            </span>
            <ArrowUpRight className="size-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            SMM, Marketing va IT xizmatlari tavsiflarini o'zbek va rus tillarida tahrirlash
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="p-5 rounded-2xl bg-[#0a1326] border border-blue-900/20 hover:border-blue-500/40 transition-all group shadow-sm hover:shadow-blue-950/40"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white group-hover:text-sky-400 transition-colors">
              Aloqa va Hero sozlamalari
            </span>
            <ArrowUpRight className="size-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Telefon raqami (+998 20 026 04 18), Telegram, Instagram va bosh sahifa matnlari
          </p>
        </Link>
      </div>
    </div>
  );
}
