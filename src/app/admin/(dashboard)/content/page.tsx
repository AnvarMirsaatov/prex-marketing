"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Sliders,
  Briefcase,
  Tags,
  Users,
  Image as ImageIcon,
  UserCheck,
  Layers,
} from "lucide-react";
import { TabBranding } from "@/components/admin/content/tab-branding";
import { TabHero } from "@/components/admin/content/tab-hero";
import { TabServices } from "@/components/admin/content/tab-services";
import { TabTariffs } from "@/components/admin/content/tab-tariffs";
import { TabPartners } from "@/components/admin/content/tab-partners";
import { TabPortfolio } from "@/components/admin/content/tab-portfolio";
import { TabTeam } from "@/components/admin/content/tab-team";

const TABS = [
  {
    id: "branding",
    label: "Asosiy sozlamalar & Logotip",
    shortLabel: "Logotip & Sozlamalar",
    icon: Sparkles,
    badge: "Brending",
  },
  {
    id: "hero",
    label: "Hero Karusel",
    shortLabel: "Hero Karusel",
    icon: Sliders,
    badge: "Bannerlar",
  },
  {
    id: "services",
    label: "Xizmatlar (UZ/RU)",
    shortLabel: "Xizmatlar",
    icon: Briefcase,
    badge: "Xizmatlar",
  },
  {
    id: "tariffs",
    label: "Tariflar & Narxlar",
    shortLabel: "Tariflar",
    icon: Tags,
    badge: "Narxlar",
  },
  {
    id: "partners",
    label: "Hamkorlar",
    shortLabel: "Hamkorlar",
    icon: Users,
    badge: "Hamkorlar",
  },
  {
    id: "portfolio",
    label: "Portfolio / Keyslar",
    shortLabel: "Portfolio",
    icon: ImageIcon,
    badge: "Keyslar",
  },
  {
    id: "team",
    label: "Jamoa",
    shortLabel: "Jamoa",
    icon: UserCheck,
    badge: "Kelajak",
  },
];

function ContentManagerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "branding";

  const [activeTab, setActiveTab] = useState<string>(
    TABS.some((t) => t.id === initialTab) ? initialTab : "branding"
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
      try {
        localStorage.setItem("prox_admin_active_tab", tabParam);
      } catch {}
    } else {
      try {
        const saved = localStorage.getItem("prox_admin_active_tab");
        if (saved && TABS.some((t) => t.id === saved)) {
          setActiveTab(saved);
          router.replace(`/admin/content?tab=${saved}`, { scroll: false });
        }
      } catch {}
    }
  }, [searchParams, router]);

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
    try {
      localStorage.setItem("prox_admin_active_tab", tabId);
    } catch {}
    router.replace(`/admin/content?tab=${tabId}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sky-400">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Sayt Kontenti</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-500/30 font-semibold uppercase tracking-wider">
                Yagona Boshqaruv Markazi
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Saytning logotipi, bannerlari, xizmatlari, tariflari va barcha matnlarini bitta joydan qulay boshqaring
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="p-1.5 rounded-2xl bg-[#0a1326] border border-blue-900/30 shadow-sm overflow-x-auto scrollbar-none touch-pan-x">
        <div className="flex items-center gap-1.5 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[44px] shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-blue-950/40 border border-transparent"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-sky-200" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Panel Content */}
      <div className="pt-2 animate-in fade-in duration-200">
        {activeTab === "branding" && <TabBranding />}
        {activeTab === "hero" && <TabHero />}
        {activeTab === "services" && <TabServices />}
        {activeTab === "tariffs" && <TabTariffs />}
        {activeTab === "partners" && <TabPartners />}
        {activeTab === "portfolio" && <TabPortfolio />}
        {activeTab === "team" && <TabTeam />}
      </div>
    </div>
  );
}

export default function ContentManagerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Yuklanmoqda...</div>}>
      <ContentManagerContent />
    </Suspense>
  );
}
