"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import type { Locale } from "@/i18n/config";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Code2,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SlideData {
  id: string;
  categoryUz: string;
  categoryRu: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  taglineUz: string;
  taglineRu: string;
  statsUz: { label: string; value: string }[];
  statsRu: { label: string; value: string }[];
  serviceValue: string;
  detailHref: string;
  icon: typeof Share2;
  gradient: string;
  accentGlow: string;
}

const SLIDES: SlideData[] = [
  {
    id: "smm",
    categoryUz: "Strategik SMM & Media",
    categoryRu: "Стратегический SMM и медиа",
    titleUz: "Brendingizni Raqamli Yetakchiga Aylantiramiz",
    titleRu: "Выводим ваш бренд в лидеры цифрового рынка",
    descUz:
      "Maqsadli auditoriyani o'rganish, professional video, storis va motion-kontent hamda ijtimoiy tarmoqlarda ishonchli obro' yaratish.",
    descRu:
      "Глубокий анализ аудитории, профессиональный видео-контент, сторис, моушн-дизайн и построение безупречной репутации бренда.",
    taglineUz: "SMM • Kontent • Brending",
    taglineRu: "SMM • Контент • Брендинг",
    statsUz: [
      { label: "Oylik qamrov", value: "+300%" },
      { label: "Muntazam kontent", value: "24/7" },
      { label: "Auditoriya ishonchi", value: "98%" },
    ],
    statsRu: [
      { label: "Охват аудитории", value: "+300%" },
      { label: "Регулярный контент", value: "24/7" },
      { label: "Доверие аудитории", value: "98%" },
    ],
    serviceValue: "SMM",
    detailHref: "/xizmatlar/smm",
    icon: Share2,
    gradient: "from-blue-600/30 via-indigo-600/20 to-transparent",
    accentGlow: "bg-blue-600/25",
  },
  {
    id: "marketing",
    categoryUz: "Maqsadli Reklama & Tizimli Savdo",
    categoryRu: "Таргетированная реклама и продажи",
    titleUz: "Har Bir Sarflangan Byudjet Sotuvga Aylanadi",
    titleRu: "Каждый вложенный бюджет работает на результат",
    descUz:
      "Instagram, Facebook, Google Ads va Telegram Ads platformalarida aniq target kampaniyalari, sotuv bo'limi tahlili va keng qamrovli marketing konsalting.",
    descRu:
      "Точный таргетинг в Instagram, Facebook, Google Ads и Telegram Ads, аудит воронки продаж и комплексный маркетинговый консалтинг.",
    taglineUz: "Target • Google Ads • Sotuvlar",
    taglineRu: "Таргет • Google Ads • Продажи",
    statsUz: [
      { label: "Reklama ROAS", value: "10x gacha" },
      { label: "Konversiya o'sishi", value: "+45%" },
      { label: "Tizimli hisobot", value: "100%" },
    ],
    statsRu: [
      { label: "ROAS рекламы", value: "До 10x" },
      { label: "Рост конверсий", value: "+45%" },
      { label: "Прозрачные отчеты", value: "100%" },
    ],
    serviceValue: "Marketing",
    detailHref: "/xizmatlar/marketing",
    icon: TrendingUp,
    gradient: "from-sky-600/30 via-blue-700/20 to-transparent",
    accentGlow: "bg-sky-500/25",
  },
  {
    id: "it",
    categoryUz: "Zamonaviy IT & Avtomatlashtirish",
    categoryRu: "IT-решения и автоматизация бизнеса",
    titleUz: "Biznesingiz Uchun Mukammal Raqamli Infratuzilma",
    titleRu: "Идеальная цифровая экосистема для вашего бизнеса",
    descUz:
      "Zamonaviy veb-saytlar, mobil ilovalar, to'lov tizimlari integratsiyasi hamda mijozlar bilan ishlashni avtomatlashtiruvchi AI va Telegram botlar.",
    descRu:
      "Высокоскоростные веб-сайты, мобильные приложения, платежные интеграции, AI и Telegram-боты для полной автоматизации бизнес-процессов.",
    taglineUz: "Saytlar • Ilovalar • AI Botlar",
    taglineRu: "Сайты • Приложения • AI Боты",
    statsUz: [
      { label: "Sayt tezligi", value: "95+ ball" },
      { label: "To'lov tizimlari", value: "Payme/Click" },
      { label: "Avtomatlashtirish", value: "24/7" },
    ],
    statsRu: [
      { label: "Скорость сайтов", value: "95+ баллов" },
      { label: "Платежные системы", value: "Payme/Click" },
      { label: "Автоматизация", value: "24/7" },
    ],
    serviceValue: "IT xizmatlari",
    detailHref: "/xizmatlar/it",
    icon: Code2,
    gradient: "from-cyan-600/30 via-blue-600/20 to-transparent",
    accentGlow: "bg-cyan-500/25",
  },
];

const AUTOPLAY_DELAY = 5500; // 5.5 seconds

export function HeroCarousel({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay handler
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  // Handle lead consultation click with service dispatch
  function handleConsultationClick(service: string) {
    // Dispatch custom event so ConsultationForm pre-selects this service
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-service-plan", {
          detail: { service, source: "hero" },
        })
      );
      const target = document.getElementById("consultation");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const slide = SLIDES[current];
  const Icon = slide.icon;

  return (
    <section
      aria-label="Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center bg-[#050b14] text-white overflow-hidden border-b border-blue-500/15 select-none"
    >
      {/* Background visual layers with Ken Burns cinematic zoom-in */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {SLIDES.map((s, index) => {
          const isActive = index === current;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Radial gradient spotlight */}
              <div
                className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full blur-[130px] transition-transform duration-[6000ms] ease-out ${
                  s.accentGlow
                } ${isActive ? "scale-110" : "scale-100"}`}
              />
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />

              {/* Dynamic decorative backdrop grid */}
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px]" />

              {/* Cinematic light beams */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            </div>
          );
        })}
      </div>

      <Container className="relative z-20 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
          {/* Main Slide Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Tagline / Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-sky-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <span className="size-2 rounded-full bg-sky-400 animate-ping" />
              <Icon className="size-3.5 text-sky-400" />
              <span>{isUz ? slide.categoryUz : slide.categoryRu}</span>
            </div>

            {/* Cinematic Headline */}
            <h1 className="text-display font-black tracking-tight leading-[1.05] text-balance bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-200 drop-shadow-sm min-h-[110px] sm:min-h-[140px] flex items-center">
              {isUz ? slide.titleUz : slide.titleRu}
            </h1>

            {/* Description */}
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed font-normal min-h-[72px]">
              {isUz ? slide.descUz : slide.descRu}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleConsultationClick(slide.serviceValue)}
                className="button button-primary shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.6)] cursor-pointer"
              >
                <span>{isUz ? "Ariza qoldirish" : "Оставить заявку"}</span>
                <ArrowRight className="size-4" />
              </button>

              <Link
                href={`/${locale}${slide.detailHref}`}
                className="button button-outline border-blue-500/30 hover:border-sky-400/60 hover:bg-blue-500/15 text-slate-200 hover:text-white"
              >
                <span>{isUz ? "Batafsil ma'lumot" : "Подробнее"}</span>
              </Link>
            </div>

            {/* Slide Key Metrics */}
            <div className="pt-6 border-t border-blue-500/15 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
              {(isUz ? slide.statsUz : slide.statsRu).map((st, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-4 rounded-xl bg-[#0a1326]/60 border border-blue-500/15 backdrop-blur-sm"
                >
                  <span className="block text-xl sm:text-2xl font-black text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    {st.value}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 block truncate">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Card / Trailer Preview Accent */}
          <div className="hidden lg:flex flex-col justify-center items-center relative">
            <div className="relative w-full max-w-sm p-8 rounded-3xl bg-[#0a1326]/85 border border-blue-500/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(2,6,23,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden group">
              {/* Ambient flare in card */}
              <div className="absolute -top-12 -right-12 size-36 rounded-full bg-blue-500/20 blur-2xl" />

              <div className="flex items-center justify-between mb-6">
                <div className="size-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-sky-400 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                  <Icon className="size-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-sky-300 text-[11px] font-bold">
                  <Zap className="size-3 text-sky-400" />
                  <span>{isUz ? "Prox Natijasi" : "Результат Prox"}</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2">
                {isUz ? slide.taglineUz : slide.taglineRu}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {isUz
                  ? "Raqamli dunyoda tizimli o'sish va yuqori darajadagi brend nufuzi."
                  : "Системный рост бизнеса и укрепление репутации в цифровой среде."}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-blue-500/15">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    {isUz ? "Kafolatlangan yondashuv" : "Гарантия подхода"}
                  </span>
                  <span className="font-bold text-sky-400">100%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Sparkles className="size-3.5 text-sky-400" />
                    {isUz ? "Innovatsion usullar" : "Инновации"}
                  </span>
                  <span className="font-bold text-white">2026 Ready</span>
                </div>
              </div>

              {/* Progress visual in card */}
              <div className="mt-6 pt-4 border-t border-blue-500/15 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {isUz ? "Slayd" : "Слайд"} {current + 1} / {SLIDES.length}
                </span>
                <span className="text-sky-400 font-semibold">
                  {isPaused ? (isUz ? "To'xtatilgan" : "Пауза") : (isUz ? "Aylanmoqda..." : "Авто...")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar (Arrows + Progress Indicators) */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-blue-500/15">
          {/* Progress Indicators */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {SLIDES.map((s, index) => {
              const isActive = index === current;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrent(index)}
                  className="flex-1 sm:flex-initial sm:w-28 text-left group cursor-pointer"
                  aria-label={`Slide ${index + 1}`}
                >
                  <div className="h-1.5 rounded-full bg-blue-950 border border-blue-900 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] w-full"
                          : "w-0 group-hover:w-1/3 bg-blue-700"
                      }`}
                    />
                  </div>
                  <span
                    className={`block text-[11px] font-bold mt-2 transition-colors ${
                      isActive ? "text-sky-300" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    0{index + 1} &bull; {s.id.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Oldingi slayd"
              className="size-11 rounded-xl bg-blue-950/80 border border-blue-500/30 hover:border-sky-400 hover:bg-blue-900/60 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Keyingi slayd"
              className="size-11 rounded-xl bg-blue-950/80 border border-blue-500/30 hover:border-sky-400 hover:bg-blue-900/60 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
