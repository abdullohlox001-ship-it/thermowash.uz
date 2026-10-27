# THERMOWASH — kotyol va isitish xizmati sayti

Next.js 15 + TypeScript + Tailwind CSS. Ikki til (`/uz`, `/ru`), ma'lumotlar bazasisiz.
Arizalar Telegram'ga keladi va zaxira sifatida `data/leads.jsonl` fayliga yoziladi.

```
Internet → Nginx (HTTPS, rate limit) → Next.js (sayt + /api/lead) → Telegram
                                                    └→ data/leads.jsonl (zaxira)
```

---

## 1. Loyiha tuzilishi

```
src/
  config/business.ts        ← BARCHA biznes ma'lumotlari (telefon, nom, shahar, ish vaqti…)
  content/
    services.ts             ← xizmatlar, xizmat sahifalari matni, forma variantlari
    home.ts                 ← muammolar, brendlar, "nega biz", jarayon, FAQ, sharhlar, SEO matn
  lib/
    i18n.ts                 ← interfeys matnlari (uz / ru)
    validation.ts           ← forma validatsiyasi (klient + server umumiy)
    seo.ts                  ← metadata, hreflang, JSON-LD (HVACBusiness, FAQ, Service)
    leads.ts                ← arizani yetkazish kanallari (Telegram, fayl — yangisini qo'shish oson)
    telegram.ts             ← Telegram yuborish (faqat serverda)
    rate-limit.ts           ← spamga qarshi limit
    analytics.ts            ← konversiya hodisalari
  components/               ← Header, MobileBottomBar, RequestForm, RequestModal, …
    sections/               ← Hero, Services, Problems, Brands, WhyUs, Process,
                              EmergencyCTA, Reviews, About, FAQ, Contact
  app/
    [lang]/page.tsx         ← bosh sahifa
    [lang]/services/[slug]  ← 6 ta xizmat sahifasi har tilda
    [lang]/privacy          ← maxfiylik siyosati
    api/lead/route.ts       ← ariza qabul qiluvchi endpoint
    sitemap.ts, robots.ts, manifest.ts
  middleware.ts             ← "/" → /uz yoki /ru (cookie → brauzer tili → uz)
deploy/                     ← Nginx konfiguratsiyasi
ecosystem.config.cjs        ← PM2
Dockerfile, docker-compose.yml
```

## 2. O'rnatish

Talab: **Node.js 20+** (22 tavsiya etiladi).

```bash
npm ci
cp .env.example .env      # keyin .env ni to'ldiring
```

## 3. Lokal ishga tushirish

```bash
npm run dev               # http://localhost:3000
```

Dev rejimida sariq ogohlantirish chiqadi, agar telefon hali placeholder bo'lsa. Sharhlar bo'limida
tahrir uchun joy ko'rsatiladi (productionda ko'rinmaydi).

## 4. `.env` sozlash

| O'zgaruvchi | Majburiy | Izoh |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://domeningiz.uz`, oxirida `/` siz. **Build paytida** o'qiladi |
| `PORT`, `HOSTNAME` | | Standart `3000`, `127.0.0.1` |
| `TELEGRAM_BOT_TOKEN` | tavsiya | BotFather tokeni |
| `TELEGRAM_CHAT_ID` | tavsiya | Bir nechta: `123,-100456` |
| `TELEGRAM_API_URL` | | Proksi/mirror kerak bo'lsa |
| `LEADS_LOG_FILE` | | Standart `<loyiha>/data/leads.jsonl`; `off` = o'chirish |
| `IP_HASH_SALT` | | Tasodifiy satr |
| `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA_ID` | | Analitika. Bo'sh = yuklanmaydi |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | | Search Console meta-teg qiymati |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | | Yandex Webmaster |

> `NEXT_PUBLIC_*` o'zgaruvchilari build ichiga yoziladi — ularni o'zgartirsangiz, `npm run build` qiling.
> Telegram o'zgaruvchilari esa faqat serverda — o'zgartirgach faqat qayta ishga tushirish kifoya.

## 5. Telegram ulash

1. Telegram'da **@BotFather** → `/newbot` → nom bering → **token**ni oling.
2. Arizalar keladigan joy:
   - **shaxsiy chat**: botingizga `/start` yozing;
   - **guruh**: guruh yarating, botni qo'shing, guruhda istalgan xabar yozing.
3. Chat ID ni bilish: brauzerda oching
   `https://api.telegram.org/bot<TOKEN>/getUpdates` → `"chat":{"id": ...}` qiymati.
   Guruh ID'si odatda `-100…` bilan boshlanadi.
4. `.env` ga yozing:
   ```
   TELEGRAM_BOT_TOKEN=1234567:AA...
   TELEGRAM_CHAT_ID=-1001234567890
   ```
5. Serverni qayta ishga tushiring (`pm2 restart thermowash`) va saytdan sinov ariza yuboring.

Xabar ko'rinishi (ariza tiliga qarab o'zbekcha yoki ruscha):

```
🔥 YANGI ZAYAVKA

Ism: Aziz
Telefon: +998901234567      ← bosilsa qo'ng'iroq
Xizmat: Kotyol ta’mirlash
Muammo: Kotyol yoqilmayapti
Manzil: Chilonzor
Til: O‘zbekcha
Vaqt: 22.09.2026, 17:36     ← Toshkent vaqti
Sahifa: /uz#hero
```

Telegram sozlanmagan yoki vaqtincha ishlamasa ham sayt ishlaydi — ariza `data/leads.jsonl` ga yoziladi
va server logida `[lead] … file:ok` ko'rinadi. Ko'rish: `tail -f data/leads.jsonl`.

## 6. Production build

```bash
npm run build     # .next/standalone yaratadi (static + public avtomatik nusxalanadi)
npm start         # node .next/standalone/server.js
```

## 7. Linux serverga deploy

### A. Mavjud Docker + Nginx serveriga (tavsiya etiladi, avtomatik)

Serverda allaqachon Nginx konteyneri 80/443 portlarni egallagan bo'lsa (boshqa loyihalar bilan
birga yashash rejimi):

```bash
# 1) Loyihani serverga yuklang (kompyuterdan)
scp -r ./thermowash root@SERVER_IP:/root/thermowash-src

# 2) Serverda bitta buyruq
cd /root/thermowash-src
bash deploy/install.sh
```

Skript so'raydi: o'rnatish papkasi, domen, `www`, Let's Encrypt email, Telegram token va chat ID.
Qolganini o'zi qiladi:

1. DNS va nginx konfiguratsiyasida domen band emasligini tekshiradi
2. Loyihani tanlangan papkaga ko'chiradi va `.env` yaratadi
3. `docker compose -f docker-compose.coexist.yml up -d --build`
4. Nginx `conf.d` ga `thermowash.conf` qo'shadi (`nginx -t` bilan tekshirib)
5. Let's Encrypt sertifikatini oladi (mavjud certbot volume'lari orqali)
6. HTTPS ni yoqadi va saytni tashqaridan tekshiradi

Xato bo'lsa konfiguratsiya qaytariladi — serverdagi boshqa saytlar ishlayveradi.

Boshqaruv:
```bash
cd /opt/thermowash                                   # yoki tanlagan papkangiz
docker compose -f docker-compose.coexist.yml ps
docker compose -f docker-compose.coexist.yml logs -f
bash deploy/update.sh        # yangi versiyani yig'ish (rollback image saqlanadi)
bash deploy/uninstall.sh     # olib tashlash (data/ saqlanadi)
```

Standart qiymatlar `deploy/install.sh` boshida turadi va env orqali o'zgartiriladi:
```bash
NGINX_CONTAINER=my-nginx NGINX_CONF_DIR=/opt/x/nginx/conf.d DOCKER_NETWORK=x_default \
CERT_CONF_VOLUME=x_certbot_conf CERT_WWW_VOLUME=x_certbot_www bash deploy/install.sh
```

### B. Toza serverga (Nginx tizimda, PM2 bilan)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm i -g pm2

cd /var/www/thermowash
npm ci
cp .env.example .env && nano .env
npm run build
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup

sudo cp deploy/kotyol-proxy.conf /etc/nginx/snippets/kotyol-proxy.conf
sudo cp deploy/nginx.conf /etc/nginx/sites-available/thermowash   # domenni almashtiring
sudo ln -s /etc/nginx/sites-available/thermowash /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot && sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot -d domen.uz -d www.domen.uz
```

**Yangilash:** `npm ci && npm run build && pm2 restart thermowash`.
`data/leads.jsonl` loyiha ildizida saqlanadi va build paytida o'chmaydi.

### Ma'lumotlar bazasi / migratsiya

Kerak emas. Keyinchalik CRM yoki baza qo'shish uchun `src/lib/leads.ts` dagi `channels`
massiviga yangi kanal qo'shing — boshqa kod o'zgarmaydi.

## 8. Rasmlar qo'shish

Saytda o'z rasmlaringiz bo'lishi ishonchni sezilarli oshiradi. Ikki joyga qo'yiladi:

1. **Hero rasmi** — birinchi ekranda (yo'q bo'lsa texnik chizma ko'rsatiladi)
2. **"Bizning ishlarimiz" galereyasi** — bo'sh bo'lsa bo'lim ko'rinmaydi

```bash
# 1) rasmlarni papkaga tashlang
public/images/hero.jpg
public/images/works/1.jpg, 2.jpg, ...

# 2) src/content/media.ts faylida yozing
export const heroPhoto: Photo | null = {
  src: "/images/hero.jpg",
  alt: { uz: "Usta gaz kotyolini ta’mirlamoqda", ru: "Мастер ремонтирует газовый котёл" },
};

export const works: Photo[] = [
  { src: "/images/works/1.jpg",
    alt: { uz: "Yangi kotyol o‘rnatildi", ru: "Установлен новый котёл" },
    caption: { uz: "Kotyol o‘rnatish", ru: "Установка котла" } },
];

# 3) yangilang
cd /opt/thermowash && bash deploy/update.sh
```

### Tezkor variant: bepul stock rasmlar

O'z suratlaringiz hali yo'q bo'lsa, vaqtincha bepul Pexels rasmlarini qo'yish mumkin:

```bash
cd /opt/thermowash
bash deploy/add-stock-photos.sh   # 6 ta rasmni yuklab oladi va media.ts ni yozadi
bash deploy/update.sh
```

Pexels litsenziyasi tijoratda ishlatishga ruxsat beradi va muallifni ko'rsatish shart emas.
Lekin bu — chet el ustalarining suratlari. O'z ish suratlaringiz paydo bo'lishi bilan
`public/images/` ichidagi fayllarni almashtiring: fayl nomlari o'sha bo'lsa, boshqa hech narsa
o'zgartirilmaydi.

Talablar: hero uchun kamida 1600×1200, galereya uchun 1000×750, hajmi 2 MB gacha.
Sayt rasmlarni avtomatik WebP/AVIF ga o'giradi va kerakli o'lchamda beradi.

⚠️ Boshqa saytlardan rasm olmang — mualliflik huquqi buziladi. Telefonda olingan
real ish surati har qanday "stock" rasmdan yaxshiroq ishlaydi. Odam yuzi ko'rinsa, ruxsat so'rang.

## 8. Tahrirlanadigan sozlamalar ro'yxati

**`src/config/business.ts`** — bitta joyda o'zgartirilsa, butun sayt (header, hero, pastki panel,
footer, kontaktlar, schema.org) yangilanadi:

| Maydon | Hozirgi qiymat | Izoh |
|---|---|---|
| `name` | `THERMOWASH` | Kompaniya nomi (uz/ru) |
| `shortName` | `THERMOWASH` | Manifest uchun |
| `phone` | `+998914580202` | Asosiy raqam (hamma joyda) |
| `phone2` | `+998993853402` | Qo'shimcha raqam |
| `telegrams` | `autocheck_uz`, `idrisov_jasurbek` | Username'lar, `@` siz; birinchisi — asosiy tugma |
| `city` | `Toshkent` / `Ташкент` | SEO sarlavhalarida |
| `serviceArea` | Toshkentning barcha tumanlari | Xizmat hududi |
| `address` | `null` | Manzil, koordinata |
| `workingHours` | 24/7 | Matn + schema |
| `experienceYears` / `experiencePlus` | `8` / `true` | "8+ yillik tajriba" |
| `warrantyMonths` | `null` | Hozir "Kafolat" (muddatsiz). Muddat kiritilsa "N oy kafolat" |
| `promo` | `null` | Aksiya qatori hero'da (faqat real taklif!) |
| `googleReviewsUrl` | `null` | "Google'da sharh qoldirish" tugmasi |
| `mapsUrl` | `null` | Xarita havolasi |
| `socials` | `[]` | schema `sameAs` |

**Kontent (`src/content/`):**
- `services.ts` — xizmat kartochkalari, 6 ta xizmat sahifasi matni, "barcha ishlar" ro'yxati, forma variantlari
- `home.ts` — muammolar, **brendlar** (`official: true` faqat rasmiy shartnoma bo'lsa), "nega biz",
  jarayon, FAQ, **sharhlar** (faqat real), "biz haqimizda" matni
- `src/lib/i18n.ts` — tugmalar, menyu, forma va xato matnlari

**Rasmlar:** `public/og.png` (1200×630, ijtimoiy tarmoqlar uchun), `public/icon.svg`,
`public/apple-icon.png` — o'z logotipingiz bilan almashtiring.

## 9. Real ma'lumot kerak bo'lgan joylar (ishga tushirishdan oldin)

- [x] Telefon raqamlari, nom (THERMOWASH), 24/7, Toshkent, Telegram, 8+ yil tajriba
- [ ] Kafolat muddati (oy) — bilsangiz `warrantyMonths` ga yozing
- [ ] Manzil (ofis bo'lsa) + Google Maps havolasi
- [ ] `.env`: domen, Telegram token va chat ID
- [ ] Logo va OG rasm
- [ ] Real sharhlar (yig'ilgach)
- [ ] Brendlar ro'yxatini tekshirish

## 10. Ishga tushirgandan keyin (SEO)

1. **Google Search Console** → domen qo'shing → tasdiqlash kodi `.env` ga → build → `sitemap.xml` ni yuboring.
2. **Yandex Webmaster** — xuddi shunday (O'zbekistonda rus tilidagi qidiruv uchun muhim).
3. **Google Business Profile** yarating: nom, telefon va ish vaqti saytdagi bilan **aynan bir xil** bo'lsin.
   Havolani `googleReviewsUrl` ga qo'ying.
4. Analitikada konversiya sifatida belgilang: `phone_click`, `request_form_submit`
   (qo'shimcha: `request_form_open`, `telegram_click`, `service_click`).

## Xavfsizlik

- Token va maxfiy kalitlar faqat `.env` da, brauzer kodiga tushmaydi.
- `/api/lead`: server validatsiyasi, boshqaruv belgilarini tozalash, Telegram HTML escape,
  8 KB so'rov limiti, Origin tekshiruvi, honeypot, minimal to'ldirish vaqti,
  IP bo'yicha limit (10 daqiqada 5, sutkada 20) + Nginx `limit_req`.
- IP ochiq saqlanmaydi — faqat tuzli xesh.
