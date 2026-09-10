# Prox Marketing Agency (proxmarketing.uz)

> Zamonaviy digital agentlik veb-sayti va boshqaruv (Admin) paneli. Next.js 16 App Router, Tailwind CSS v4, TypeScript va Prisma (SQLite/PostgreSQL) asosida ishlab chiqilgan.

---

## 🚀 Asosiy Imkoniyatlar

1. **Ikki tillilik (Lokalizatsiya)**:
   - O'zbek (UZ) va Rus (RU) tillarida to'liq qo'llab-quvvatlash.
   - Kelajakda ingliz (EN) tilini oson qo'shish arxitekturasi.
   - Qulay til almashtirgich (Header va Footer).

2. **SEO va Optimizatsiya (Google PageSpeed 90+)**:
   - Har bir sahifa uchun dinamik `meta title`, `meta description`, `keywords` va `canonical` havolalar.
   - OpenGraph va Twitter Card ijtimoiy tarmoqlar integratsiyasi.
   - Avtomatik `/sitemap.xml` va `/robots.txt` generatorlari.
   - Next.js avtomatik AVIF va WebP rasm formatlari optimizatsiyasi.

3. **To'liq Sahifalar va Bo'limlar**:
   - **Bosh sahifa** (`/`): Hero banner, xizmatlar preview, USP ("Nega biz?"), hamkorlar slayderi, tariflar va konsultatsiya formasi.
   - **Biz haqimizda** (`/biz-haqimizda`): Agentlik missiyasi, qadriyatlari va yo'nalishlari.
   - **Xizmatlar** (`/xizmatlar`): SMM (`/xizmatlar/smm`), Kompleks Marketing (`/xizmatlar/marketing`) va IT xizmatlari (`/xizmatlar/it`).
   - **Tariflar** (`/tariflar`): SMM va Marketing bo'yicha oylik va uzoq muddatli shaffof paketlar.
   - **Hamkorlar** (`/hamkorlar`): Hamkor va mijoz kompaniyalar galereyasi.
   - **Portfolio** (`/portfolio`): Amalga oshirilgan loyihalar va keyslar (Admin bilan avtomatik sinxron).
   - **Aloqa** (`/aloqa`): Bepul konsultatsiya formasi va to'g'ridan-to'g'ri aloqa kanallari.

4. **Bog'lanish va Telegram Bot Integratsiyasi**:
   - Mijoz arizasi tushishi bilanoq ma'lumotlar bazasiga (Leads) saqlanadi.
   - Bir vaqtning o'zida Telegram bot orqali menejer chatiga darhol bildirishnoma yuboriladi.
   - Doimiy Telegram tezkor chat tugmasi (`@manager_prox`).

5. **Himoyalangan Admin Panel (`/admin`)**:
   - **Xavfsiz kirish**: `bcrypt` xeshlangan parollar va `httpOnly` JWT cookie autentifikatsiyasi.
   - **So'rovlar (Leads)**: Arizalar ro'yxati, filtrlar (Barchasi, Yangi, Ko'rildi, Yakunlandi), statusni o'zgartirish va to'g'ridan-to'g'ri qo'ng'iroq qilish.
   - **Tariflar (Tariffs)**: Narxlar, davrlar va imkoniyatlar ro'yxatini tahrirlash.
   - **Xizmatlar (Services)**: Xizmatlar matnlari va tavsiflarini boshqarish.
   - **Hamkorlar (Partners)**: Logotiplar yuklash va kompaniyalar ro'yxatini boshqarish.
   - **Portfolio (Portfolio)**: Yangi keyslar qo'shish va tahrirlash.
   - **Jamoa (Team)**: Jamoa a'zolari va bir klikda saytda faollashtirish (`isActive`).
   - **Sayt sozlamalari (Settings)**: Aloqa telefonlari, ijtimoiy tarmoqlar, Hero banner matnlari va Telegram bot token sozlamalari.

---

## 🛠 Texnologiyalar Steki

- **Freymvork**: Next.js 16 (App Router)
- **Til**: TypeScript
- **Stillar**: Tailwind CSS v4, PostCSS
- **Ma'lumotlar bazasi**: SQLite (Prisma ORM orqali — PostgreSQL/MySQL'ga oson ko'chiriladi)
- **Ikonkalar**: Lucide React
- **Xavfsizlik**: Bcryptjs, JWT sessiyalar

---

## 💻 Mahalliy Ishga Tushirish

### Talablar:
- Node.js 20.9+
- npm yoki yarn

### Qadamlar:

1. Repozitoriyani klonlang:
   ```bash
   git clone <repo-url>
   cd "prox marketing"
   ```

2. Bog'liqliklarni o'rnating:
   ```bash
   npm install
   ```

3. Muhit o'zgaruvchilarini sozlang:
   ```bash
   cp .env.example .env
   ```

4. Ma'lumotlar bazasini tayyorlang (dastlabki ma'lumotlar bilan):
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. Dasturni ishga tushiring:
   ```bash
   npm run dev
   ```
   Brauzerda `http://localhost:3000` manzilini oching.

---

## 🔐 Standart Admin Kirish Ma'lumotlari

- **Kirish manzili**: `http://localhost:3000/admin/login`
- **Login**: `admin`
- **Parol**: `prox2026!`

*(Parolni yoki bot sozlamalarini `/admin/settings` sahifasidan o'zgartirishingiz mumkin)*

---

## ☁️ Vercel'ga Joylashtirish (Deploy to Vercel)

1. Ushbu loyihani GitHub hisobingizga yuklang (push qiling).
2. [Vercel](https://vercel.com) saytiga kiring va **"Add New..." &rarr; "Project"** tugmasini bosing.
3. GitHub'dagi `prox-marketing` repozitoriyasini tanlang (**Import**).
4. **Environment Variables** bo'limida quyidagilarni kiriting:
   - `DATABASE_URL`: `file:./dev.db`
   - `ADMIN_SESSION_SECRET`: Maxfiy xavfsiz kalit so'z (masalan: `prox_jwt_secret_production_2026`)
   - `TELEGRAM_BOT_TOKEN`: *(Ixtiyoriy)* Telegram bot tokeni
   - `TELEGRAM_CHAT_ID`: *(Ixtiyoriy)* Telegram chat ID
5. **"Deploy"** tugmasini bosing. Vercel avtomatik tarzda build qilib, jonli URL va bepul SSL sertifikatini taqdim etadi.
