import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { localizedPath } from "@/config/routes";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/config";
import {
  Target,
  Eye,
  TrendingUp,
  Lightbulb,
  HeartHandshake,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export async function AboutPage({ locale }: { locale: Locale }) {
  const isUz = locale === "uz";

  // Team members module from database
  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const values = [
    {
      icon: Eye,
      title: isUz ? "Shaffoflik va Halollik" : "Прозрачность и честность",
      desc: isUz
        ? "Har bir reklama byudjeti va natijalar bo'yicha ochiq muloqot hamda to'liq shaffof oylik hisobotlar taqdim etamiz."
        : "Предоставляем полностью прозрачные ежемесячные отчеты по рекламным бюджетам и ключевым показателям.",
    },
    {
      icon: TrendingUp,
      title: isUz ? "Natijadorlikka yo'naltirilganlik" : "Ориентация на результат",
      desc: isUz
        ? "Biz shunchaki post qo'ymaymiz — asosiy e'tibor biznesingizning real savdosi va konversiyalarini oshirishga qaratiladi."
        : "Мы не просто выкладываем публикации — наш фокус на реальных продажах и конверсиях вашего бизнеса.",
    },
    {
      icon: Lightbulb,
      title: isUz ? "Innovatsiya va Kreativlik" : "Инновации и креатив",
      desc: isUz
        ? "Bozordagi eng so'nggi marketing trendlari, sun'iy intellekt vositalari va nostandart kreativ dizaynlarni qo'llaymiz."
        : "Используем передовые маркетинговые тренды, возможности искусственного интеллекта и креативный дизайн.",
    },
    {
      icon: HeartHandshake,
      title: isUz ? "Individual Yondashuv" : "Индивидуальный подход",
      desc: isUz
        ? "Shablon yechimlar yo'q. Har bir loyiha uchun auditoriya va soha xususiyatlaridan kelib chiqqan holda maxsus strategiya tuziladi."
        : "Никаких шаблонных решений. Для каждого проекта разрабатывается персональная стратегия с учетом специфики рынка.",
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO & INTRO */}
      <section>
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand mb-3">
                {isUz ? "Prox Marketing Agency" : "Prox Marketing Agency"}
              </span>
              <h1 className="text-display font-black tracking-tight text-ink leading-tight mb-6">
                {isUz ? "Biz haqimizda" : "О компании"}
              </h1>
              <p className="text-lg sm:text-xl text-ink font-medium leading-relaxed mb-6">
                {isUz
                  ? "Prox — bizneslarni raqamli dunyoda tizimli rivojlantirish va sotuvlarni oshirishga ixtisoslashgan digital marketing agentligi. Strategik SMM, marketing, maqsadli reklama va zamonaviy avtomatlashtirish yechimlari orqali brendlarni yangi bosqichga olib chiqadi."
                  : "Prox — digital-маркетинговое агентство, специализирующееся на системном развитии бизнеса в цифровой среде и увеличении продаж. Выводит бренды на новый уровень с помощью стратегического SMM, маркетинга, таргетированной рекламы и современных решений автоматизации."}
              </p>
              <p className="text-sm text-muted leading-relaxed max-w-2xl">
                {isUz
                  ? "Biznesingizning har bir bosqichida — brend yaratishdan tortib, maqsadli auditoriyani jalb qilish va sotuvlarni avtomatlashtirishgacha bo'lgan to'liq yo'lni birgalikda bosib o'tamiz."
                  : "Мы сопровождаем бизнес на всех ключевых этапах цифрового развития — от создания концепции бренда до масштабирования продаж и автоматизации процессов."}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="bg-surface py-14 sm:py-20 border-y border-line">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="p-8 sm:p-10 rounded-panel bg-paper border border-line shadow-card flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-6">
                  <Target className="size-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-ink mb-4">
                  {isUz ? "Bizning Missiyamiz" : "Наша Миссия"}
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  {isUz
                    ? "O'zbekiston va xalqaro miqyosdagi bizneslarga zamonaviy digital vositalar orqali barqaror, tizimli va o'lchanadigan daromad o'sishiga erishishda ishonchli strategik hamkor bo'lish."
                    : "Быть надежным стратегическим партнером для бизнеса, обеспечивая устойчивый, системный и измеримый рост продаж с помощью современных digital-инструментов."}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-line/60 flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                <ShieldCheck className="size-4" />
                <span>{isUz ? "Tizimli natija kafolati" : "Гарантия системного результата"}</span>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-panel bg-ink text-paper flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="size-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-6">
                  <TrendingUp className="size-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-paper mb-4">
                  {isUz ? "Bizning Maqsadimiz" : "Наша Цель"}
                </h2>
                <p className="text-sm text-paper/80 leading-relaxed">
                  {isUz
                    ? "Mijozlarimiz investitsiya kiritgan har bir so'm byudjet o'zini oqlashini ta'minlash hamda brendlarni o'z sohasida yetakchi darajaga ko'tarish."
                    : "Обеспечить максимальную окупаемость каждого инвестированного рекламного бюджета и вывести бренды наших партнеров в лидеры рынка."}
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-6 border-t border-paper/15 flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
                <span>{isUz ? "Raqamlar bilan o'lchanadigan o'sish" : "Рост, измеримый цифрами"}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. VALUES */}
      <section>
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
                {isUz ? "Asosiy ustunlar" : "Фундаментальные принципы"}
              </span>
              <h2 className="text-heading font-black tracking-tight text-ink">
                {isUz ? "Bizning Qadriyatlarimiz" : "Наши Ценности"}
              </h2>
              <p className="text-sm text-muted mt-3">
                {isUz
                  ? "Biz har bir loyihaga mas'uliyat va yuqori professionallik bilan yondashamiz"
                  : "Принципы, на которых строится работа с каждым клиентом и проектом"}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-card border border-line bg-paper interactive-card flex flex-col justify-between"
                >
                  <div>
                    <div className="size-11 rounded-xl bg-surface text-brand border border-line flex items-center justify-center mb-5">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-base font-bold text-ink mb-2">{v.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. TEAM MODULE (TZ 11 & 18) */}
      <section className="bg-surface py-14 sm:py-20 border-t border-line">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">
                {isUz ? "Jamoa" : "Команда"}
              </span>
              <h2 className="text-heading font-black tracking-tight text-ink">
                {isUz ? "Bizning Jamoamiz" : "Наша Команда"}
              </h2>
            </div>
            <p className="text-xs text-muted max-w-sm">
              {isUz
                ? "O'z sohasida ko'p yillik tajribaga ega kreativ va texnik mutaxassislar"
                : "Креативные и технические эксперты с практическим опытом"}
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="p-10 rounded-panel bg-paper border border-line text-center space-y-3">
              <div className="size-12 rounded-2xl bg-surface text-brand border border-line flex items-center justify-center mx-auto">
                <Users className="size-6" />
              </div>
              <h3 className="text-base font-bold text-ink">
                {isUz ? "Jamoamiz doimiy o'sishda" : "Наша команда постоянно расширяется"}
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                {isUz
                  ? "Biz bilan kreativ dizaynerlar, video-makerlar, tajribali targetologlar hamda IT mutaxassislar faoliyat yuritadi. Har bir loyiha ustida ixtisoslashgan alohida jamoa ishlaydi."
                  : "В нашей команде работают опытные маркетологи, таргетологи, дизайнеры и IT-разработчики. Над каждым проектом трудится выделенная экспертная группа."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-card bg-paper border border-line flex flex-col justify-between"
                >
                  <div>
                    <div className="size-16 rounded-full bg-surface border border-line flex items-center justify-center text-lg font-black text-brand mb-4">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-ink text-base">{member.name}</h3>
                    <p className="text-xs text-brand font-medium mt-1">
                      {isUz ? member.roleUz : member.roleRu}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 5. CTA SECTION */}
      <section>
        <Container>
          <div className="p-8 sm:p-12 rounded-panel bg-ink text-paper relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                {isUz
                  ? "Biznesingizni yangi bosqichga olib chiqishga tayyormisiz?"
                  : "Готовы вывести ваш бизнес на новый уровень?"}
              </h2>
              <p className="text-sm text-paper/80 leading-relaxed">
                {isUz
                  ? "Hoziroq bepul konsultatsiyaga yoziling va loyihangiz uchun individual marketing rejasiga ega bo'ling."
                  : "Запишитесь на бесплатную консультацию и получите персональную стратегию развития вашего проекта."}
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <ButtonLink
                href={`${localizedPath(locale, "home")}#consultation`}
                variant="secondary"
                className="shadow-lg"
              >
                <span>{isUz ? "Konsultatsiya olish" : "Получить консультацию"}</span>
                <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
