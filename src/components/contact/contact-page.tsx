import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/ui/reveal";
import { ConsultationForm } from "@/components/home/consultation-form";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import {
  PhoneCall,
  Send,
  MapPin,
  Clock,
  Mail,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

function InstagramIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  const contactCards = [
    {
      id: "phone",
      title: isUz ? "Telefon orqali bog'lanish" : "Связаться по телефону",
      value: site.phone,
      href: site.phoneHref,
      action: isUz ? "Qo'ng'iroq qilish" : "Позвонить",
      icon: PhoneCall,
      color: "text-brand",
      bgColor: "bg-brand/10",
      borderColor: "hover:border-brand",
      subtext: isUz
        ? "Dush - Shanba: 09:00 - 18:00 (To'g'ridan-to'g'ri aloqa)"
        : "Пн - Сб: 09:00 - 18:00 (Прямая связь)",
    },
    {
      id: "telegram",
      title: isUz ? "Telegram orqali tezkor yozish" : "Написать в Telegram",
      value: site.telegramLabel,
      href: site.telegram,
      action: isUz ? "Telegramda yozish" : "Открыть чат",
      icon: Send,
      color: "text-telegram",
      bgColor: "bg-telegram/10",
      borderColor: "hover:border-telegram",
      subtext: isUz
        ? "Menejerimiz 15 daqiqa ichida javob beradi"
        : "Менеджер ответит в течение 15 минут",
    },
    {
      id: "instagram",
      title: isUz ? "Instagram sahifamiz" : "Наш Instagram",
      value: site.instagramLabel,
      href: site.instagram,
      action: isUz ? "Sahifani ko'rish" : "Перейти в профиль",
      icon: InstagramIcon,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "hover:border-rose-400",
      subtext: isUz
        ? "Foydali keyslar, natijalar va agentlik faoliyati"
        : "Полезные кейсы, результаты и закулисье агентства",
    },
  ];

  const serviceOptions = isUz
    ? [
        { value: "SMM", label: "SMM (Ijtimoiy tarmoqlar)" },
        { value: "Marketing", label: "Marketing (Kompleks savdo)" },
        { value: "IT xizmatlari", label: "IT xizmatlari (Sayt va botlar)" },
      ]
    : [
        { value: "SMM", label: "SMM (Маркетинг в соцсетях)" },
        { value: "Marketing", label: "Маркетинг (Комплексный)" },
        { value: "IT xizmatlari", label: "IT-услуги (Сайты и боты)" },
      ];

  const faqList = isUz
    ? [
        {
          q: "Dastlabki konsultatsiya bepulmi?",
          a: "Ha, dastlabki 15-30 daqiqalik audit va konsultatsiya mutlaqo bepul. Mutaxassisimiz loyihangizni tahlil qilib, optimal yo'nalishni tavsiya qiladi.",
        },
        {
          q: "Ariza yuborgandan keyin qancha vaqtda javob olaman?",
          a: "Ish vaqtida (09:00 - 18:00) yuborilgan har qanday so'rovga mutaxassisimiz 15 daqiqa ichida qo'ng'iroq qiladi yoki Telegram orqali bog'lanadi.",
        },
        {
          q: "Hamkorlik qanday rasmiylashtiriladi?",
          a: "Biz barcha xizmatlarni rasmiy shartnoma (yuridik shaxs sifatida) asosida ko'rsatamiz. Har oy yakunida shaffof hisobot va dalolatnomalar topshiriladi.",
        },
      ]
    : [
        {
          q: "Первичная консультация бесплатна?",
          a: "Да, первичный аудит и консультация абсолютно бесплатны. Наш ведущий специалист проанализирует ваш бизнес и предложит оптимальную стратегию.",
        },
        {
          q: "Как быстро я получу ответ после заявки?",
          a: "В рабочие часы (09:00 - 18:00) мы связываемся с вами в течение 15 минут по телефону или в Telegram.",
        },
        {
          q: "Как оформляется сотрудничество?",
          a: "Мы работаем строго по официальному договору. В конце каждого отчетного периода предоставляется подробный отчет с оцифрованными результатами.",
        },
      ];

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand mb-3">
                {isUz ? "TZ 6.7 & 9-bo'lim • Aloqa va Integratsiya" : "Разделы 6.7 и 9 ТЗ • Связь и Интеграция"}
              </span>
              <h1 className="text-display font-black tracking-tight text-ink leading-tight mb-6">
                {isUz ? "Biz bilan bog'laning" : "Свяжитесь с нами"}
              </h1>
              <p className="text-lg sm:text-xl text-ink font-medium leading-relaxed mb-4">
                {isUz
                  ? "Biznesingizni yangi darajaga olib chiqish uchun qulay aloqa kanalini tanlang"
                  : "Выберите удобный способ связи, чтобы обсудить рост вашего бизнеса"}
              </p>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {isUz
                  ? "Biz doim aloqadamiz. Qo'ng'iroq qiling, Telegram orqali yozing yoki quyidagi forma orqali bepul konsultatsiyaga ariza qoldiring."
                  : "Мы всегда на связи. Позвоните, напишите в Telegram или отправьте заявку на бесплатную консультацию через форму ниже."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. DIRECT CONTACT CARDS (TZ 6.7) */}
      <section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactCards.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.id}
                  href={c.href}
                  target={c.id === "phone" ? undefined : "_blank"}
                  rel={c.id === "phone" ? undefined : "noreferrer"}
                  className={`p-6 sm:p-8 rounded-panel bg-paper border border-line shadow-card transition-all flex flex-col justify-between group ${c.borderColor} hover:shadow-lg`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`size-12 rounded-2xl ${c.bgColor} ${c.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <Icon className="size-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted group-hover:text-ink flex items-center gap-1">
                        <span>{c.action}</span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-muted block mb-1">
                      {c.title}
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-ink mb-3 group-hover:text-brand transition-colors">
                      {c.value}
                    </p>
                  </div>

                  <p className="text-xs text-muted pt-4 border-t border-line/60">
                    {c.subtext}
                  </p>
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. APPLICATION & CONSULTATION FORM (TZ 9) */}
      <section id="consultation" className="scroll-mt-8 py-16 bg-surface border-y border-line">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left info column */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="size-3.5" />
                <span>{isUz ? "TZ 9-bo'lim • Buyurtma so'rovi" : "Раздел 9 ТЗ • Заявка"}</span>
              </div>
              <h2 className="text-heading font-black tracking-tight text-ink">
                {isUz ? "Bepul konsultatsiya va smeta olish" : "Получите бесплатную консультацию и смету"}
              </h2>
              <p className="mt-4 text-muted text-sm leading-relaxed">
                {isUz
                  ? "Formani to'ldiring. Mas'ul mutaxassisimiz 15 daqiqa ichida loyihangiz talablarini o'rganib, sizga mos yechim va aniq hisob-kitobni taqdim etadi."
                  : "Заполните форму, и мы свяжемся с вами в течение 15 минут, чтобы рассчитать точную смету и подобрать идеальный тариф."}
              </p>
            </div>

            {/* Why contact us list */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    {isUz ? "15 daqiqada tezkor javob" : "Быстрый ответ за 15 минут"}
                  </h4>
                  <p className="text-xs text-muted">
                    {isUz ? "Ish vaqtida arizangiz hech qachon kechiktirilmaydi" : "В рабочее время ни одна заявка не остается без внимания"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    {isUz ? "Shaffof narxlar va rasmiy shartnoma" : "Прозрачные цены и официальный договор"}
                  </h4>
                  <p className="text-xs text-muted">
                    {isUz ? "Yashirin to'lovlarsiz, to'liq yuridik kafolat bilan" : "Без скрытых платежей, с полной юридической гарантией"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-accent/20 text-ink flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="size-4 text-brand" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    {isUz ? "Loyiha bo'yicha bepul audit" : "Бесплатный первичный аудит"}
                  </h4>
                  <p className="text-xs text-muted">
                    {isUz ? "Mavjud sahifalaringiz yoki saytingizdagi kamchiliklar tahlili" : "Разбор текущих ошибок в маркетинге или на сайте"}
                  </p>
                </div>
              </div>
            </div>

            {/* Office & Work Schedule info */}
            <div className="p-6 rounded-panel bg-paper border border-line space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                {isUz ? "Ofis va Ish tartibi" : "Офис и График работы"}
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-ink font-medium">
                  <MapPin className="size-4 text-brand shrink-0" />
                  <span>{isUz ? "Toshkent shahri, O'zbekiston" : "город Ташкент, Узбекистан"}</span>
                </div>
                <div className="flex items-center gap-3 text-ink font-medium">
                  <Clock className="size-4 text-brand shrink-0" />
                  <span>{isUz ? "Dushanba - Shanba: 09:00 - 18:00" : "Понедельник - Суббота: 09:00 - 18:00"}</span>
                </div>
                <div className="flex items-center gap-3 text-ink font-medium">
                  <Mail className="size-4 text-brand shrink-0" />
                  <a href="mailto:info@proxmarketing.uz" className="hover:text-brand hover:underline">
                    info@proxmarketing.uz
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="rounded-panel border border-line bg-paper p-6 sm:p-10 shadow-card">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-ink">
                {isUz ? "So'rov formasini to'ldiring" : "Заполните форму заявки"}
              </h3>
              <p className="text-xs text-muted mt-1">
                {isUz
                  ? "Barcha maydonlarni to'ldiring, ma'lumotlaringiz to'liq xavfsiz saqlanadi."
                  : "Укажите ваши данные для получения детального расчета."}
              </p>
            </div>

            <ConsultationForm
              key={locale}
              labels={{
                name: isUz ? "Ismingiz" : "Ваше имя",
                phone: isUz ? "Telefon raqamingiz" : "Номер телефона",
                service: isUz ? "Qiziqtirgan xizmat turi" : "Интересующая услуга",
                message: isUz ? "Loyiha haqida qisqacha izoh" : "Комментарий к заявке",
                choose: isUz ? "Xizmat turini tanlang" : "Выберите услугу",
                submit: isUz ? "So'rovni yuborish" : "Отправить запрос",
                notice: isUz ? "Ma'lumotlar maxfiy saqlanadi." : "Конфиденциальность гарантируется.",
                required: isUz ? "Ismingizni kiriting." : "Укажите ваше имя.",
                checked: isUz ? "So'rovingiz qabul qilindi!" : "Заявка успешно принята!",
              }}
              services={serviceOptions}
              variant="radio"
            />
          </div>
        </Container>
      </section>

      {/* 4. FAQ SECTION */}
      <section>
        <Container className="max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="size-3.5" />
              <span>FAQ</span>
            </div>
            <h2 className="text-heading font-black tracking-tight text-ink">
              {isUz ? "Ko'p so'raladigan savollar" : "Часто задаваемые вопросы"}
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {faqList.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-panel bg-paper border border-line shadow-xs space-y-2"
              >
                <h3 className="text-base font-bold text-ink flex items-start gap-2.5">
                  <span className="text-brand font-black text-sm">0{idx + 1}.</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
