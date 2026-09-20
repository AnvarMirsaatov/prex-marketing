import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ConsultationForm } from "@/components/home/consultation-form";
import { localizedPath } from "@/config/routes";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  Share2,
  TrendingUp,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

export function ServicesPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  const services = [
    {
      id: "smm",
      slug: "smm",
      index: "01",
      title: isUz ? "SMM (Social Media Marketing)" : "SMM (Маркетинг в социальных сетях)",
      category: "SMM",
      icon: Share2,
      desc: isUz
        ? "Ijtimoiy tarmoqlarda brendingizni tizimli rivojlantirish, auditoriyani mijozga aylantirish va sotuvlarni oshirish."
        : "Системное продвижение вашего бренда в соцсетях, превращение аудитории в покупателей и рост продаж.",
      features: isUz
        ? [
            "Strategiya ishlab chiqish — auditoriyani o'rganish, maqsadlarni belgilash va yo'l xaritasini tuzish",
            "Kontent yaratish — professional video, storis, motion va kreativ dizaynlar",
            "Post va storilarni boshqarish — muntazam, sifatli va maqsadli kontent rejalari",
            "Reklama kampaniyalari — Instagram va Facebook platformalarida to'g'ri target kreativlarni ishga tushirish",
            "Brend imijini mustahkamlash — mijozlar bilan ishonchli aloqani shakllantirish",
            "Analitika va hisobot — natijalarni raqamlar orqali o'lchash va har oy yakunida hisobot topshirish",
          ]
        : [
            "Разработка стратегии — анализ аудитории, постановка целей и формирование дорожной карты",
            "Создание контента — профессиональный видеопродакшн, сторис, моушн и креативный дизайн",
            "Ведение постов и сторис — регулярный, качественный и целевой контент-план",
            "Рекламные кампании — запуск таргетированной рекламы в Instagram и Facebook с конверсионными креативами",
            "Укрепление имиджа бренда — формирование доверительных отношений с целевой аудиторией",
            "Аналитика и отчетность — оцифровка результатов в понятных цифрах и ежемесячный подробный отчет",
          ],
      formOption: isUz ? "SMM xizmatlari" : "SMM услуги",
    },
    {
      id: "marketing",
      slug: "marketing",
      index: "02",
      title: isUz ? "Kompleks Marketing" : "Комплексный маркетинг",
      category: "Marketing",
      icon: TrendingUp,
      desc: isUz
        ? "Biznesingizning barcha marketing kanallarini yagona tizimga birlashtirish va savdo ko'rsatkichlarini maksimal darajada oshirish."
        : "Объединение всех каналов маркетинга в единую систему для максимального роста продаж и узнаваемости бренда.",
      features: isUz
        ? [
            "SMM xizmatlaridagi barcha takliflar va imkoniyatlar",
            "Target reklama — to'g'ri auditoriya tanlash va byudjetni optimallashtirish; Google Ads va Telegram Ads",
            "Branding — logo, firma uslubi, brandbook, brend ovozi va vizual imijini yaratish",
            "Marketing strategiya va konsalting — bozor tahlili, strategik reja va sotuvni oshirish bo'yicha tavsiyalar",
            "Influencer marketing (blogerlar bilan ishlash) — to'g'ri bloger tanlash va reklama kampaniyasini boshqarish",
            "Sotuv bo'limi nazorati — sotuvchilarni o'qitish, savdoga tayyorlash va to'liq sotuvni nazoratga olish",
          ]
        : [
            "Все предложения и возможности, входящие в пакет SMM-сопровождения",
            "Таргетированная реклама — оптимизация бюджета; контекстная реклама Google Ads и Telegram Ads",
            "Брендинг — логотип, фирменный стиль, брендбук, тональность коммуникации и визуальный имидж",
            "Маркетинговая стратегия и консалтинг — глубокий анализ рынка и рекомендации по увеличению среднего чека",
            "Инфлюенс-маркетинг (работа с блогерами) — подбор лидеров мнений и проведение интеграций под ключ",
            "Контроль отдела продаж — обучение менеджеров, внедрение скриптов и полный аудит воронки продаж",
          ],
      formOption: isUz ? "Kompleks Marketing" : "Комплексный маркетинг",
    },
    {
      id: "it",
      slug: "it",
      index: "03",
      title: isUz ? "IT va Raqamli Yechimlar" : "IT и цифровые решения",
      category: "IT",
      icon: Code2,
      desc: isUz
        ? "Zamonaviy veb-saytlar, mobil ilovalar va biznes jarayonlarini avtomatlashtiruvchi sun'iy intellektli botlar ishlab chiqish."
        : "Разработка современных веб-сайтов, мобильных приложений и AI-ботов для автоматизации бизнес-процессов.",
      features: isUz
        ? [
            "Veb-sayt ishlab chiqish — landing page, zamonaviy korporativ sayt, internet-do'kon",
            "Mobil ilovalar yaratish — iOS va Android uchun qulay va tezkor mobil dasturlar",
            "Onlayn buyurtma va to'lov tizimlari bilan integratsiya (Payme, Click, Uzum)",
            "UI/UX dizayn — foydalanuvchi uchun maksimal qulay interfeyslar va brendga mos dizayn yechimlari",
            "Texnik qo'llab-quvvatlash — veb-sayt va dasturlarga doimiy xizmat ko'rsatish, xavfsizlik va yangilanishlar",
            "Sun'iy intellekt va botlar — Telegram botlar, Instagramda AI chat-botlar yaratish va biznes hisoblariga ulash",
          ]
        : [
            "Разработка веб-сайтов — высококонверсионные лендинги, корпоративные сайты, интернет-магазины",
            "Мобильные приложения — нативные и кроссплатформенные приложения для iOS и Android",
            "Интеграция онлайн-заказов и платежных систем (Payme, Click, Uzum)",
            "UI/UX дизайн — эргономичные интерфейсы с фокусом на пользовательский опыт и фирменный стиль",
            "Техническая поддержка — регулярное обслуживание, безопасность данных и своевременные обновления",
            "Искусственный интеллект и боты — умные Telegram-боты, AI чат-боты для Instagram и интеграция с CRM",
          ],
      formOption: isUz ? "IT xizmatlari" : "IT-услуги",
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO BANNER */}
      <section className="relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 size-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="size-3.5" />
                <span>{isUz ? "TZ 7-bo'lim • Xizmatlar Katalogi" : "Раздел 7 ТЗ • Каталог услуг"}</span>
              </span>
              <h1 className="text-display font-black tracking-tight text-white leading-tight mb-5">
                {isUz ? "Bizning Xizmatlarimiz" : "Наши Услуги"}
              </h1>
              <p className="text-lg sm:text-xl text-slate-200 font-medium leading-relaxed mb-3">
                {isUz
                  ? "Biznesingizni tizimli o'stirish va sotuvlarni oshirish uchun 3 ta asosiy yo'nalish"
                  : "3 ключевых направления для системного масштабирования продаж вашего бизнеса"}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                {isUz
                  ? "Har bir yo'nalish o'z sohasining mutaxassislari tomonidan chuqur tahlil va aniq maqsadlar asosida amalga oshiriladi."
                  : "Каждое направление реализуется профильными специалистами на основе глубокой аналитики и четких KPI."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. SERVICES DETAILED CARDS */}
      <section className="space-y-12">
        <Container className="space-y-12">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={svc.id}
                className="scroll-mt-8 p-8 sm:p-12 rounded-3xl bg-[#0a1326]/80 backdrop-blur-md border border-blue-500/15 shadow-[0_12px_40px_-15px_rgba(3,7,18,0.6)] hover:border-blue-500/35 hover:shadow-[0_16px_50px_-10px_rgba(37,99,235,0.12)] transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-blue-500/15">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sky-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                          Yo'nalish {svc.index} &bull; {svc.category}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {svc.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{svc.desc}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <ButtonLink href={`#consultation`}>
                      <span>{isUz ? "Ariza qoldirish" : "Оставить заявку"}</span>
                      <ArrowRight className="size-4" />
                    </ButtonLink>
                    <ButtonLink
                      href={localizedPath(locale, svc.slug as "smm" | "marketing" | "it")}
                      variant="outline"
                    >
                      <span>{isUz ? "Batafsil" : "Подробнее"}</span>
                    </ButtonLink>
                  </div>
                </div>

                {/* Features grid */}
                <div className="pt-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
                    <ShieldCheck className="size-4 text-sky-400" />
                    <span>{isUz ? "Xizmat tarkibiga quyidagilar kiradi:" : "В состав услуги входит:"}</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {svc.features.map((feat, fIndex) => (
                      <div
                        key={fIndex}
                        className="p-5 rounded-2xl bg-[#0d1a36]/60 border border-blue-500/10 hover:border-blue-500/25 transition-colors flex items-start gap-3"
                      >
                        <CheckCircle2 className="size-4 text-sky-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{feat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* 3. APPLICATION / CONSULTATION FORM ANCHOR */}
      <section id="consultation" className="scroll-mt-8 bg-gradient-to-b from-transparent via-[#070e1d] to-[#040812] py-16 sm:py-24 border-t border-blue-500/15 relative overflow-hidden">
        <div className="absolute -left-20 top-1/3 size-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              <span>{isUz ? "Ariza qoldirish" : "Подача заявки"}</span>
            </div>

            <h2 className="text-heading font-black tracking-tight text-white">
              {isUz ? "Xizmatlarga buyurtma berish" : "Заказ услуг и расчет сметы"}
            </h2>

            <p className="mt-4 text-slate-300 text-sm leading-relaxed mb-8">
              {isUz
                ? "O'zingizga ma'qul bo'lgan xizmat turini tanlang va aloqa ma'lumotlaringizni qoldiring. Mutaxassisimiz 15 daqiqa ichida bog'lanib, loyihangiz bo'yicha batafsil konsultatsiya beradi."
                : "Выберите интересующее направление и оставьте контактные данные. Наш специалист свяжется с вами в течение 15 минут для обсуждения деталей."}
            </p>

            <div className="space-y-4 pt-4 border-t border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Telefon:</span>
                  <a href={site.phoneHref} className="text-base font-bold text-white hover:text-sky-400 transition-colors">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Send className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-400">Telegram:</span>
                  <a
                    href={site.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-sky-400 hover:underline"
                  >
                    {site.telegramLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-[#0a1326]/90 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
            <h3 className="text-lg font-bold text-white mb-1">
              {isUz ? "Ariza formasi" : "Форма заявки"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {isUz
                ? "Maydonlarni to'ldiring, ma'lumotlar to'g'ridan-to'g'ri mas'ul mutaxassisga yuboriladi:"
                : "Заполните поля, и запрос мгновенно поступит нашему менеджеру:"}
            </p>
            <ConsultationForm
              key={locale}
              labels={{
                name: isUz ? "Ism" : "Имя",
                phone: isUz ? "Telefon raqam" : "Номер телефона",
                service: isUz ? "Qiziqtirgan xizmat" : "Интересующая услуга",
                message: isUz ? "Loyiha haqida izoh" : "Комментарий о проекте",
                choose: isUz ? "Tanlang" : "Выберите",
                submit: isUz ? "Arizani yuborish" : "Отправить заявку",
                notice: isUz ? "Ma'lumotlar maxfiy saqlanadi." : "Данные строго конфиденциальны.",
                required: isUz ? "Telefon raqamini kiriting." : "Укажите номер телефона.",
                checked: isUz ? "Arizangiz qabul qilindi!" : "Заявка успешно принята!",
              }}
              services={services.map((s) => ({
                value: s.formOption,
                label: s.formOption,
              }))}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
