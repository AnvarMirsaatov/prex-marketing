import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { ConsultationForm } from "@/components/home/consultation-form";
import { localizedPath } from "@/config/routes";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  Share2,
  TrendingUp,
  Code2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Phone,
  Send,
} from "lucide-react";

interface ServiceDetailProps {
  locale: Locale;
  slug: "smm" | "marketing" | "it";
}

export function ServiceDetailPage({ locale, slug }: ServiceDetailProps) {
  const isUz = locale === "uz";

  const dataMap = {
    smm: {
      category: "SMM",
      icon: Share2,
      title: isUz ? "SMM — Ijtimoiy Tarmoqlarda Marketing" : "SMM — Маркетинг в социальных сетях",
      headline: isUz
        ? "Brendingizni Instagram va Facebook platformalarida tizimli rivojlantirish"
        : "Системное развитие и масштабирование вашего бренда в Instagram и Facebook",
      description: isUz
        ? "Biz shunchaki chiroyli rasm yoki oddiy postlar qo'ymaymiz. Bizning SMM xizmatimiz maqsadli auditoriyani o'rganish, qiziqtirish va ularni real mijozga aylantiruvchi marketing voronkasi ustiga quriladi."
        : "Мы не просто создаем красивый визуальный контент. Наш SMM выстроен вокруг воронки продаж, которая привлекает целевую аудиторию и конвертирует ее в реальных постоянных клиентов.",
      features: isUz
        ? [
            {
              title: "Strategiya ishlab chiqish",
              desc: "Auditoriyani o'rganish, maqsadlarni belgilash va oylik yo'l xaritasini tuzish",
            },
            {
              title: "Professional kontent yaratish",
              desc: "Professional video, storis, 2D/3D motion dizaynlar va kreativ grafikalar",
            },
            {
              title: "Post va storilarni boshqarish",
              desc: "Muntazam, sifatli va maqsadli kontent rejalari asosida to'liq sahifa nazorati",
            },
            {
              title: "Reklama kampaniyalari (Target)",
              desc: "Instagram va Facebook platformalarida to'g'ri target kreativlarni ishga tushirish",
            },
            {
              title: "Brend imijini mustahkamlash",
              desc: "Mijozlar bilan ishonchli aloqani shakllantirish va auditoriya sodiqligini oshirish",
            },
            {
              title: "Analitika va hisobot",
              desc: "Natijalarni raqamlar orqali o'lchash va har oy yakunida shaffof hisobot topshirish",
            },
          ]
        : [
            {
              title: "Разработка стратегии",
              desc: "Глубокий анализ аудитории, сегментация, постановка измеримых целей и дорожная карта",
            },
            {
              title: "Создание контента",
              desc: "Профессиональный видеопродакшн, мобилография, моушн-дизайн и трендовые сторис",
            },
            {
              title: "Ведение публикаций",
              desc: "Публикация по утвержденному контент-плану с вовлекающим копирайтингом",
            },
            {
              title: "Таргетированная реклама",
              desc: "Запуск таргета в Instagram и Facebook с постоянным A/B тестированием связок",
            },
            {
              title: "Имидж бренда",
              desc: "Формирование высокой лояльности и доверия со стороны потенциальных покупателей",
            },
            {
              title: "Аналитика и отчетность",
              desc: "Ежемесячный прозрачный отчет с оцифровкой всех показателей охвата и конверсий",
            },
          ],
      formOption: isUz ? "SMM xizmatlari" : "SMM услуги",
    },
    marketing: {
      category: "Marketing",
      icon: TrendingUp,
      title: isUz ? "Kompleks Marketing va Savdoni Rivojlantirish" : "Комплексный маркетинг и рост продаж",
      headline: isUz
        ? "Marketing strategiya, reklama byudjetini boshqarish va to'liq savdoni nazoratga olish"
        : "Стратегический маркетинг, эффективное управление бюджетом и аудит продаж",
      description: isUz
        ? "Biznesingizning barcha aloqa nuqtalarini qamrab oluvchi to'liq marketing xizmatlari. Biz faqat reklama bermaymiz, balki sotuv bo'limi bilan birgalikda ishlaymiz va umumiy tushumni oshirishga mas'ul bo'lamiz."
        : "Полный комплекс маркетинговых решений для максимального охвата рынка. Мы синхронизируем рекламу с вашим отделом продаж для обеспечения высокой конверсии лидов в сделки.",
      features: isUz
        ? [
            {
              title: "SMM xizmatlaridagi barcha takliflar",
              desc: "SMM bo'yicha barcha strategiya, kontent va postlar to'liq xizmat tarkibiga kiradi",
            },
            {
              title: "Target va kontekst reklama",
              desc: "To'g'ri auditoriya tanlash va byudjetni optimallashtirish; Google Ads va Telegram Ads",
            },
            {
              title: "Branding va Firma uslubi",
              desc: "Logo, firma uslubi, brandbook, brend ovozi va korporativ imijni yaratish",
            },
            {
              title: "Marketing strategiya va konsalting",
              desc: "Bozor tahlili, strategik reja va o'rtacha chekni ko'tarish bo'yicha amaliy tavsiyalar",
            },
            {
              title: "Influencer marketing",
              desc: "To'g'ri blogerlar bilan ishlash, shartnomalar tuzish va reklama kampaniyasini boshqarish",
            },
            {
              title: "Sotuv bo'limi nazorati",
              desc: "Sotuvchilarni o'qitish, skriptlar joriy qilish va to'liq sotuv jarayonini nazoratga olish",
            },
          ]
        : [
            {
              title: "Все возможности SMM",
              desc: "Полное ведение страниц, создание продающего визуала и регулярный контент-маркетинг",
            },
            {
              title: "Таргетированная и контекстная реклама",
              desc: "Точный подбор аудитории и оптимизация затрат в Google Ads и Telegram Ads",
            },
            {
              title: "Брендинг и фирменный стиль",
              desc: "Разработка логотипа, брендбука, айдентики и позиционирования на рынке",
            },
            {
              title: "Стратегия и консалтинг",
              desc: "Глубокое маркетинговое исследование рынка, конкурентов и рекомендации по масштабированию",
            },
            {
              title: "Инфлюенс-маркетинг",
              desc: "Подбор релевантных блогеров, организация интеграций и контроль результативности",
            },
            {
              title: "Контроль отдела продаж",
              desc: "Аудит звонков, обучение менеджеров, внедрение скриптов и сквозной контроль воронки",
            },
          ],
      formOption: isUz ? "Kompleks Marketing" : "Комплексный маркетинг",
    },
    it: {
      category: "IT",
      icon: Code2,
      title: isUz ? "IT va Raqamli Yechimlar" : "IT и цифровые решения",
      headline: isUz
        ? "Veb-saytlar, mobil ilovalar, to'lov tizimlari va sun'iy intellektli botlar"
        : "Разработка сайтов, приложений, платежных интеграций и AI-ботов",
      description: isUz
        ? "Biznesingiz uchun tezkor, xavfsiz va zamonaviy raqamli infratuzilmani quramiz. Yuqori konversiyali lendinglar, internet-do'konlar hamda mijozlar bilan muloqotni avtomatlashtiruvchi Telegram botlar."
        : "Создаем современную цифровую инфраструктуру для вашего бизнеса: быстрые сайты с высокой конверсией, интернет-магазины, мобильные приложения и умные чат-боты.",
      features: isUz
        ? [
            {
              title: "Veb-sayt ishlab chiqish",
              desc: "Landing page, korporativ sayt va to'liq internet-do'konlar yaratish",
            },
            {
              title: "Mobil ilovalar yaratish",
              desc: "iOS va Android platformalari uchun qulay va zamonaviy mobil ilovalar",
            },
            {
              title: "Onlayn to'lov tizimlari",
              desc: "Payme, Click, Uzum va bank kartalari orqali to'lovlarni qabul qilish integratsiyasi",
            },
            {
              title: "UI/UX dizayn",
              desc: "Foydalanuvchilar uchun intuitiv qulay, zamonaviy va brendga mos interfeyslar",
            },
            {
              title: "Texnik qo'llab-quvvatlash",
              desc: "Veb-sayt va dasturlarga uzluksiz texnik xizmat ko'rsatish, xavfsizlik va yangilanishlar",
            },
            {
              title: "Sun'iy intellekt va botlar",
              desc: "Telegram botlar, Instagramda AI chat-botlar yaratish va biznes CRM tizimiga ulash",
            },
          ]
        : [
            {
              title: "Разработка сайтов",
              desc: "Высокоскоростные лендинги, корпоративные порталы и масштабируемые e-commerce платформы",
            },
            {
              title: "Мобильные приложения",
              desc: "Разработка удобных и функциональных мобильных приложений для iOS и Android",
            },
            {
              title: "Платежные интеграции",
              desc: "Бесшовная интеграция с платежными системами Payme, Click, Uzum и банковскими шлюзами",
            },
            {
              title: "UI/UX дизайн",
              desc: "Современный пользовательский интерфейс с акцентом на удобство и высокую конверсию",
            },
            {
              title: "Техническая поддержка",
              desc: "Регулярное сопровождение, мониторинг доступности, безопасность и резервное копирование",
            },
            {
              title: "Искусственный интеллект и боты",
              desc: "Умные Telegram-боты для заказов, AI чат-боты для соцсетей и автоматизация процессов",
            },
          ],
      formOption: isUz ? "IT xizmatlari" : "IT-услуги",
    },
  };

  const item = dataMap[slug];
  const Icon = item.icon;

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section>
        <Container>
          <div className="mb-6">
            <Link
              href={localizedPath(locale, "services")}
              className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-brand transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>{isUz ? "Barcha xizmatlarga qaytish" : "Назад ко всем услугам"}</span>
            </Link>
          </div>

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
              <Icon className="size-3.5" />
              <span>{item.category}</span>
            </div>

            <h1 className="text-display font-black tracking-tight text-ink leading-tight">
              {item.title}
            </h1>

            <p className="text-xl font-bold text-brand leading-snug">{item.headline}</p>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
              {item.description}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <ButtonLink href="#consultation" className="shadow-lg">
                <span>{isUz ? "Ushbu xizmatga ariza berish" : "Заказать услугу"}</span>
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href={localizedPath(locale, "pricing")} variant="outline">
                <span>{isUz ? "Tariflar bilan tanishish" : "Ознакомиться с тарифами"}</span>
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. DETAILED FEATURES */}
      <section className="bg-surface py-14 sm:py-20 border-y border-line">
        <Container>
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
              {isUz ? "Batafsil tarkib" : "Подробный состав"}
            </span>
            <h2 className="text-heading font-black tracking-tight text-ink">
              {isUz ? "Xizmat doirasidagi asosiy ishlar" : "Ключевые этапы и состав работ"}
            </h2>
            <p className="text-xs text-muted mt-2">
              {isUz
                ? "TZ 7-bo'limiga binoan quyidagi barcha vazifalar to'liq amalga oshiriladi:"
                : "В соответствии с разделом 7 ТЗ выполняются следующие задачи:"}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {item.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card bg-paper border border-line flex flex-col justify-between interactive-card shadow-sm"
              >
                <div>
                  <div className="size-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-xs mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2">{feat.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-line/60 flex items-center gap-1.5 text-[11px] font-semibold text-brand">
                  <CheckCircle2 className="size-3.5" />
                  <span>{isUz ? "Kafolatlangan xizmat" : "Гарантированная услуга"}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. DIRECT INQUIRY FORM */}
      <section id="consultation" className="scroll-mt-8 py-16 bg-paper">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="size-3.5" />
              <span>{isUz ? "Ariza topshirish" : "Подача заявки"}</span>
            </div>

            <h2 className="text-heading font-black tracking-tight text-ink">
              {isUz ? "Ushbu xizmat bo'yicha bepul smeta oling" : "Получите расчет стоимости услуги"}
            </h2>

            <p className="mt-4 text-muted text-sm leading-relaxed mb-8">
              {isUz
                ? "Maydonlarni to'ldiring, 15 daqiqa ichida mas'ul mutaxassisimiz siz bilan bog'lanib, loyihangiz talablari va muddatlarini muhokama qiladi."
                : "Заполните форму, и наш эксперт свяжется с вами в течение 15 минут для обсуждения требований и сроков проекта."}
            </p>

            <div className="space-y-4 pt-4 border-t border-line">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-muted">Telefon orqali:</span>
                  <a href={site.phoneHref} className="text-base font-bold text-ink hover:text-brand">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-telegram/10 text-telegram flex items-center justify-center shrink-0">
                  <Send className="size-5" />
                </div>
                <div>
                  <span className="block text-xs text-muted">Telegram:</span>
                  <a
                    href={site.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-telegram hover:underline"
                  >
                    {site.telegramLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-panel border border-line bg-surface p-6 sm:p-10 shadow-card">
            <h3 className="text-lg font-bold text-ink mb-1">
              {isUz ? "Ariza qoldirish" : "Оставить заявку"}
            </h3>
            <p className="text-xs text-muted mb-6">
              {isUz
                ? `${item.title} bo'yicha buyurtma so'rovi:`
                : `Запрос на услугу ${item.title}:`}
            </p>
            <ConsultationForm
              key={locale}
              labels={{
                name: isUz ? "Ism" : "Имя",
                phone: isUz ? "Telefon raqam" : "Номер телефона",
                service: isUz ? "Tanlangan xizmat" : "Выбранная услуга",
                message: isUz ? "Loyiha tafsilotlari" : "Детали проекта",
                choose: isUz ? "Tanlang" : "Выберите",
                submit: isUz ? "Arizani yuborish" : "Отправить заявку",
                notice: isUz ? "Ma'lumotlar maxfiy saqlanadi." : "Данные строго конфиденциальны.",
                required: isUz ? "Telefon raqamini kiriting." : "Укажите номер телефона.",
                checked: isUz ? "Arizangiz qabul qilindi!" : "Заявка успешно принята!",
              }}
              services={[{ value: item.formOption, label: item.formOption }]}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
