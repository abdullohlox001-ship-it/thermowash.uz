/**
 * Bosh sahifa kontenti / Контент главной страницы.
 * Hammasi tahrirlanadi — UI komponentlariga tegmasdan.
 */
import type { Lang } from "@/lib/i18n";

type L = Record<Lang, string>;

/* ---------------- Muammolar / Проблемы ---------------- */
export const problems: { id: string; service: string; text: L; hint: L }[] = [
  { id: "no-start", service: "repair", text: { uz: "Kotyol yoqilmayapti", ru: "Котёл не включается" }, hint: { uz: "Yoqish, plata yoki gaz ta’minoti", ru: "Розжиг, плата или подача газа" } },
  { id: "no-hot-water", service: "repair", text: { uz: "Suvni qizdirmayapti", ru: "Не греет воду" }, hint: { uz: "Uch yo‘lli klapan, ikkilamchi almashtirgich", ru: "Трёхходовой клапан, вторичный теплообменник" } },
  { id: "pressure", service: "repair", text: { uz: "Bosim tushib ketmoqda", ru: "Падает давление" }, hint: { uz: "Oqish, kengaytirish baki, xavfsizlik klapani", ru: "Протечка, расширительный бак, сбросной клапан" } },
  { id: "error-code", service: "diagnostics", text: { uz: "Xato kodi chiqyapti", ru: "Выдаёт код ошибки" }, hint: { uz: "Kodni ayting — sababini oldindan taxmin qilamiz", ru: "Назовите код — заранее подскажем причину" } },
  { id: "radiators", service: "heating", text: { uz: "Radiatorlar yaxshi qizimayapti", ru: "Плохо греют батареи" }, hint: { uz: "Havo, nasos yoki tizim ifloslanishi", ru: "Воздух, насос или загрязнение системы" } },
  { id: "noise", service: "repair", text: { uz: "Kotyoldan g‘alati ovoz chiqmoqda", ru: "Котёл странно шумит" }, hint: { uz: "Nasos, ventilyator yoki quyqa", ru: "Насос, вентилятор или накипь" } },
  { id: "leak", service: "repair", text: { uz: "Suv sizib chiqmoqda", ru: "Течёт вода" }, hint: { uz: "Zichlagichlar, almashtirgich, ulanishlar", ru: "Уплотнения, теплообменник, соединения" } },
  { id: "cold-radiators", service: "flush", text: { uz: "Radiatorlar sovuq qolyapti", ru: "Батареи остаются холодными" }, hint: { uz: "Tizim ifloslangan — yuvish kerak bo‘lishi mumkin", ru: "Система засорена — возможно, нужна промывка" } },
  { id: "weak-hot-water", service: "boiler-flush", text: { uz: "Issiq suv kuchsiz oqyapti", ru: "Слабый напор горячей воды" }, hint: { uz: "Issiqlik almashtirgichda quyqa", ru: "Накипь в теплообменнике" } },
  { id: "shutdown", service: "repair", text: { uz: "Kotyol tez-tez o‘chib qolmoqda", ru: "Котёл часто отключается" }, hint: { uz: "Datchiklar, tutun chiqarish, qizib ketish", ru: "Датчики, дымоудаление, перегрев" } },
];

/* ---------------- Brendlar / Марки ----------------
 * Qo'shish/o'chirish uchun faqat shu ro'yxatni tahrirlang.
 * ⚠️ "Rasmiy servis" / "авторизованный сервис" deb yozmang, agar rasmiy shartnoma bo'lmasa.
 * Rasmiy hamkorlik bo'lsa: official: true — saytda belgi chiqadi.
 */
export const brands: { name: string; official?: boolean }[] = [
  { name: "Baxi" },
  { name: "Bosch" },
  { name: "Vaillant" },
  { name: "Navien" },
  { name: "Immergas" },
  { name: "Protherm" },
  { name: "Ferroli" },
  { name: "Buderus" },
  { name: "Viessmann" },
];

/* ---------------- Nega biz / Почему мы ---------------- */
export const whyUs: { title: L; text: L }[] = [
  {
    title: { uz: "Tajribali ustalar", ru: "Опытные мастера" },
    text: { uz: "Kotyollar va isitish tizimlari bilan ishlaydigan ustalar — asosiy ixtisosimiz shu.", ru: "Мастера, которые специализируются на котлах и отоплении, а не на всём подряд." },
  },
  {
    title: { uz: "Kafolat", ru: "Гарантия" },
    text: { uz: "Bajarilgan ishga kafolat beramiz. Shartlari ish boshlanishidan oldin aytiladi.", ru: "Даём гарантию на выполненную работу. Условия озвучиваем до начала ремонта." },
  },
  {
    title: { uz: "24/7 tezkor chiqish", ru: "Выезд 24/7" },
    text: { uz: "Kechayu kunduz, dam olish kunlarisiz — Toshkentning istalgan tumaniga chiqamiz.", ru: "Круглосуточно и без выходных — выезжаем в любой район Ташкента." },
  },
  {
    title: { uz: "Aniq diagnostika", ru: "Точная диагностика" },
    text: { uz: "Avval sababini topamiz, keyin ta’mirlaymiz. Keraksiz qism almashtirilmaydi.", ru: "Сначала находим причину, потом ремонтируем. Без лишней замены деталей." },
  },
  {
    title: { uz: "Sifatli ehtiyot qismlar", ru: "Качественные запчасти" },
    text: { uz: "Kotyol modeliga mos, ishonchli ehtiyot qismlardan foydalanamiz.", ru: "Используем надёжные запчасти, подходящие к модели котла." },
  },
  {
    title: { uz: "Shaffof narx", ru: "Прозрачная цена" },
    text: { uz: "Narxni ish boshlanishidan oldin aytamiz. Kelishilmagan qo‘shimcha to‘lov yo‘q.", ru: "Называем цену до начала работ. Никаких несогласованных доплат." },
  },
];

/* ---------------- Jarayon / Процесс ---------------- */
export const processSteps: { title: L; text: L }[] = [
  { title: { uz: "Ariza qoldirasiz", ru: "Вы оставляете заявку" }, text: { uz: "Qo‘ng‘iroq qiling yoki saytda ariza qoldiring.", ru: "Позвоните или оставьте заявку на сайте." } },
  { title: { uz: "Usta siz bilan bog‘lanadi", ru: "Мастер связывается с вами" }, text: { uz: "Muammoni aniqlashtiradi va kelish vaqtini kelishadi.", ru: "Уточняет проблему и согласует время приезда." } },
  { title: { uz: "Diagnostika", ru: "Диагностика" }, text: { uz: "Nosozlik aniqlanadi, narx oldindan aytiladi.", ru: "Находим неисправность и называем цену заранее." } },
  { title: { uz: "Ta’mirlash yoki o‘rnatish", ru: "Ремонт или установка" }, text: { uz: "Ish bajariladi va kotyol barcha rejimlarda tekshiriladi.", ru: "Выполняем работу и проверяем котёл во всех режимах." } },
];

/* ---------------- FAQ ----------------
 * Javoblarda tasdiqlanmagan va'da (muddat, narx) yozmang.
 */
export const faq: Record<Lang, { q: string; a: string }[]> = {
  uz: [
    { q: "Kotyol yoqilmayapti — nima qilish kerak?", a: "Avval elektr ta’minoti, gaz krani ochiqligi va manometrdagi bosimni tekshiring (odatda 1–2 bar oralig‘ida bo‘lishi kerak). Ekranda xato kodi bo‘lsa, uni yozib oling. Kotyolni qayta-qayta o‘chirib yoqmang va korpusini ochmang — ustani chaqiring." },
    { q: "Kotyol ta’mirlash qancha turadi?", a: "Narx nosozlikka va kerakli ehtiyot qismga bog‘liq. Usta diagnostikadan so‘ng aniq narxni aytadi va faqat sizning roziligingizdan keyin ishni boshlaydi." },
    { q: "Usta uyga chiqadimi?", a: "Ha, usta manzilingizga keladi. Aniq kelish vaqti qo‘ng‘iroq paytida kelishiladi." },
    { q: "Ta’mirga kafolat bormi?", a: "Ha, bajarilgan ishga kafolat beriladi. Kafolat shartlari ish boshlanishidan oldin aytiladi." },
    { q: "Qaysi kotyollarni ta’mirlaysiz?", a: "Maishiy gaz va elektr kotyollar: devorga osiladigan va polga qo‘yiladigan, bir va ikki konturli modellar. Brendingiz ro‘yxatda bo‘lmasa, qo‘ng‘iroq qilib modelini ayting." },
    { q: "Yangi kotyol o‘rnatib bera olasizmi?", a: "Ha. Uyingizga mos quvvatni tanlashda yordam beramiz, kotyolni o‘rnatamiz, isitish tizimiga ulaymiz va ishga tushiramiz." },
    { q: "Usta qanchalik tez keladi?", a: "Bu manzilingiz va ish yuklamasiga bog‘liq. Qo‘ng‘iroq qilsangiz, eng yaqin bo‘sh vaqtni darhol aytamiz." },
    { q: "Isitish tizimini yuvish (promivka) nima va u kerakmi?", a: "Yuvish — quvur va radiatorlar ichidagi quyqa, zang va loyqani chiqarish. Radiatorlar bir tekis qizimayotgan bo‘lsa, tizim shovqin qilsa yoki uy sekin isiyotgan bo‘lsa kerak bo‘ladi. Ko‘p hollarda tizimni almashtirishdan arzonroq tushadi." },
    { q: "Kotyolni qancha vaqtda bir yuvish kerak?", a: "Suv qattiqligiga qarab, odatda 1–2 yilda bir marta. Issiq suv kuchsizlashgan yoki kotyol qizib ketish xatosini bera boshlagan bo‘lsa, muddatidan oldin ham kerak bo‘lishi mumkin." },
    { q: "Kechasi yoki dam olish kunida usta chaqirsa bo‘ladimi?", a: "Ha, biz 24/7 ishlaymiz — dam olish va bayram kunlari ham. Toshkentning istalgan tumaniga chiqamiz." },
  ],
  ru: [
    { q: "Котёл не включается — что делать?", a: "Сначала проверьте электропитание, открыт ли газовый кран и давление на манометре (обычно оно должно быть в пределах 1–2 бар). Если на дисплее ошибка — запишите код. Не перезапускайте котёл много раз подряд и не вскрывайте корпус — вызовите мастера." },
    { q: "Сколько стоит ремонт котла?", a: "Стоимость зависит от неисправности и нужных запчастей. Мастер называет точную цену после диагностики и начинает работу только с вашего согласия." },
    { q: "Выезжает ли мастер на дом?", a: "Да, мастер приезжает по вашему адресу. Точное время приезда согласуем по телефону." },
    { q: "Есть ли гарантия на ремонт?", a: "Да, на выполненную работу даётся гарантия. Условия гарантии озвучиваем до начала работ." },
    { q: "Какие котлы вы ремонтируете?", a: "Бытовые газовые и электрические котлы: настенные и напольные, одно- и двухконтурные. Если вашей марки нет в списке — позвоните и назовите модель." },
    { q: "Можно ли установить новый котёл?", a: "Да. Поможем подобрать мощность под ваш дом, установим котёл, подключим к системе отопления и запустим." },
    { q: "Как быстро приезжает мастер?", a: "Зависит от вашего адреса и загрузки мастеров. Позвоните — сразу назовём ближайшее свободное время." },
    { q: "Что такое промывка системы отопления и нужна ли она?", a: "Промывка — удаление накипи, ржавчины и ила из труб и радиаторов. Нужна, если батареи греют неравномерно, система шумит или дом долго прогревается. Чаще всего это дешевле, чем менять систему." },
    { q: "Как часто нужно промывать котёл?", a: "В зависимости от жёсткости воды обычно раз в 1–2 года. Если напор горячей воды упал или котёл выдаёт ошибку перегрева, промывка может понадобиться раньше." },
    { q: "Можно ли вызвать мастера ночью или в выходной?", a: "Да, мы работаем круглосуточно, 24/7 — в том числе в выходные и праздники. Выезжаем в любой район Ташкента." },
  ],
};

/* ---------------- Sharhlar / Отзывы ----------------
 * ⚠️ FAQAT REAL SHARHLAR. Soxta sharh qo'shmang.
 * Ro'yxat bo'sh bo'lsa, bo'lim productionda ko'rinmaydi
 * (dev rejimida tahrir uchun joy ko'rsatiladi).
 *
 * Misol:
 * { author: "Aziz", district: { uz: "Chilonzor", ru: "Чиланзар" },
 *   text: { uz: "...", ru: "..." }, date: "2026-01-15", rating: 5, source: "google" }
 */
export type Review = {
  author: string;
  district?: L;
  text: L;
  date: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  source?: "google" | "telegram" | "site";
};

export const reviews: Review[] = [];

/* ---------------- "Biz haqimizda" / SEO matn ----------------
 * Tabiiy matn: qidiruvdagi turli yozilishlar (kotyol, kotel, katyol, qozon /
 * котёл, котел, котлов) spam bo'lmagan holda ishlatilgan.
 */
export const about: Record<Lang, string[]> = {
  uz: [
    "Biz uy va xonadonlardagi isitish uskunalari bilan ishlaymiz: kotyol ta’mirlash, yangi kotyol o‘rnatish, diagnostika va mavsumiy texnik xizmat. Kimdir uni kotyol, kimdir kotel, katyol yoki isitish qozoni deb ataydi — gap bitta qurilma haqida, va unga malakali kotyol ustasi kerak.",
    "Gaz kotyol ham, elektr kotyol ham murakkab uskuna: gorelka, nasos, kengaytirish baki, elektron plata va datchiklar birgalikda ishlaydi. Shuning uchun usta faqat bitta qismni emas, butun isitish tizimini tekshiradi — radiatorlar, quvurlar va bosimgacha.",
    "Ismimizdagi “wash” — tizimni yuvish demakdir. Suvdagi tuzlar yillar davomida quvur, radiator va issiqlik almashtirgich devorlarida quyqa bo‘lib qotadi: radiatorlar sovuq qoladi, issiq suv kuchsizlanadi, gaz sarfi esa oshadi. Kimyoviy yuvish (promivka) uskunani almashtirmasdan tizimni tiklaydi.",
    "Qish oldidan kotyolni ko‘rikdan o‘tkazish eng arzon yo‘l: kichik nosozlik sovuqda katta ta’mirga aylanmaydi. Agar kotyol allaqachon to‘xtagan bo‘lsa — qo‘ng‘iroq qiling, usta chaqiruvini imkon qadar tez tashkil qilamiz.",
  ],
  ru: [
    "Мы работаем с домашним отопительным оборудованием: ремонт котлов, установка нового котла, диагностика и сезонное обслуживание. Котёл, котел, отопительный котёл — неважно, как вы его называете: для надёжной работы ему нужен грамотный мастер по котлам.",
    "И газовый, и электрический котёл — сложное оборудование: горелка, насос, расширительный бак, плата управления и датчики работают вместе. Поэтому мастер проверяет не одну деталь, а всю систему отопления — вплоть до радиаторов, труб и давления.",
    "Слово «wash» в нашем названии — про промывку. Соли из воды годами оседают на стенках труб, радиаторов и теплообменника: батареи остаются холодными, напор горячей воды падает, а газа уходит больше. Химическая промывка возвращает систему в рабочее состояние без замены оборудования.",
    "Обслуживание котлов перед зимой — самый недорогой способ избежать поломки: мелкая неисправность не превратится в дорогой ремонт в мороз. Если котёл уже остановился — звоните, организуем выезд мастера как можно быстрее.",
  ],
};
