/**
 * Xizmatlar kontenti / Контент услуг.
 * Kartochkalar, xizmat sahifalari va forma variantlari shu yerdan olinadi.
 * CMS ulanganda ushbu massivni API javobi bilan almashtirish kifoya.
 */
import type { Lang } from "@/lib/i18n";

type L = Record<Lang, string>;
type LL = Record<Lang, string[]>;

export type IconName = "flame" | "gauge" | "install" | "wrench" | "radiator" | "alert" | "gas" | "drop" | "tank";

export interface ServicePage {
  metaTitle: L;
  metaDescription: L;
  h1: L;
  intro: L;
  whatWeDo: LL;
  symptoms: LL;
  faq: Record<Lang, { q: string; a: string }[]>;
}

export interface Service {
  id: string;
  icon: IconName;
  title: L;
  short: L;
  /** Bosh sahifadagi 6 ta kartochkada ko'rsatilsinmi */
  featured: boolean;
  /** Alohida SEO sahifasi (null = sahifasi yo'q) */
  slug: L | null;
  page?: ServicePage;
}

export const services: Service[] = [
  {
    id: "repair",
    icon: "flame",
    featured: true,
    title: { uz: "Kotyol ta’mirlash", ru: "Ремонт котла" },
    short: {
      uz: "Yoqilmaslik, xato kodlari, bosim tushishi, suv oqishi — nosozlik sababini topib, bartaraf etamiz.",
      ru: "Не включается, выдаёт ошибку, падает давление, течёт — находим причину и устраняем.",
    },
    slug: { uz: "kotyol-tamirlash", ru: "remont-kotla" },
    page: {
      metaTitle: {
        uz: "Kotyol ta’mirlash — kotyol ustasi uyga chiqadi",
        ru: "Ремонт котла на дому — мастер по котлам",
      },
      metaDescription: {
        uz: "Gaz va elektr kotyollarni ta’mirlash: yoqilmaslik, xato kodlari, bosim tushishi, suv oqishi. Kotyol ustasi uyga chiqadi, diagnostika va kafolat.",
        ru: "Ремонт газовых и электрических котлов на дому: не включается, ошибки, падает давление, течь. Выезд мастера, диагностика, гарантия на работу.",
      },
      h1: { uz: "Kotyol ta’mirlash", ru: "Ремонт котлов на дому" },
      intro: {
        uz: "Kotyol (ko‘pchilik uni kotel yoki isitish qozoni deb ham ataydi) odatda eng kerakli paytda — sovuq kunda to‘xtab qoladi. Usta joyida diagnostika qiladi, nosozlik sababini tushuntiradi va narxni ish boshlanishidan oldin kelishadi. Nosoz qismni tozalash, sozlash yoki almashtirish orqali kotyolni qayta ishga tushiramiz.",
        ru: "Котёл обычно ломается в самый неподходящий момент — в холодный день. Мастер проводит диагностику на месте, объясняет причину неисправности и согласовывает стоимость до начала работ. Чистим, настраиваем или меняем неисправный узел и возвращаем котёл в работу.",
      },
      whatWeDo: {
        uz: [
          "Gorelka va yoqish tizimini tekshirish va sozlash",
          "Xato kodlarini o‘qish va sababini aniqlash",
          "Elektron plata, datchiklar va termostatni tekshirish",
          "Sirkulyatsiya nasosi va kengaytirish bakini almashtirish",
          "Issiqlik almashtirgichni tozalash, oqishlarni bartaraf etish",
          "Ta’mirdan so‘ng kotyolni barcha rejimlarda sinovdan o‘tkazish",
        ],
        ru: [
          "Проверка и настройка горелки и системы розжига",
          "Считывание кодов ошибок и поиск причины",
          "Проверка платы управления, датчиков и термостата",
          "Замена циркуляционного насоса и расширительного бака",
          "Промывка теплообменника, устранение протечек",
          "Проверка котла во всех режимах после ремонта",
        ],
      },
      symptoms: {
        uz: [
          "Kotyol yoqilmayapti yoki yoqilib darhol o‘chib qolyapti",
          "Ekranda xato kodi chiqyapti",
          "Bosim tez-tez tushib ketyapti",
          "Issiq suv yo‘q yoki radiatorlar qizimayapti",
          "Kotyoldan shovqin, taqillash yoki hushtak ovozi chiqyapti",
          "Kotyol ostida suv tomchilayapti",
        ],
        ru: [
          "Котёл не включается или сразу гаснет",
          "На дисплее код ошибки",
          "Постоянно падает давление",
          "Нет горячей воды или не греют батареи",
          "Котёл шумит, стучит или свистит",
          "Под котлом капает вода",
        ],
      },
      faq: {
        uz: [
          {
            q: "Kotyolni ta’mirlash qancha turadi?",
            a: "Narx nosozlik turiga va ehtiyot qismga bog‘liq. Usta diagnostikadan so‘ng aniq narxni aytadi va siz rozi bo‘lgandan keyingina ishni boshlaydi.",
          },
          {
            q: "Ta’mir uyda qilinadimi?",
            a: "Ko‘pchilik nosozliklar joyida bartaraf etiladi. Agar murakkab qism kerak bo‘lsa, usta buni oldindan aytadi va muddatini kelishib oladi.",
          },
        ],
        ru: [
          {
            q: "Сколько стоит ремонт котла?",
            a: "Цена зависит от неисправности и запчастей. Мастер называет точную стоимость после диагностики и приступает к работе только после вашего согласия.",
          },
          {
            q: "Ремонт делается на дому?",
            a: "Большинство неисправностей устраняется на месте. Если нужна сложная запчасть, мастер предупредит заранее и согласует сроки.",
          },
        ],
      },
    },
  },
  {
    id: "diagnostics",
    icon: "gauge",
    featured: true,
    title: { uz: "Diagnostika", ru: "Диагностика" },
    short: {
      uz: "Kotyol va tizimni to‘liq tekshiramiz, nosozlik sababini aniqlab, ta’mir narxini oldindan aytamiz.",
      ru: "Полная проверка котла и системы: находим причину и называем стоимость ремонта заранее.",
    },
    slug: { uz: "kotyol-diagnostikasi", ru: "diagnostika-kotla" },
    page: {
      metaTitle: {
        uz: "Kotyol diagnostikasi — nosozlik sababini aniqlash",
        ru: "Диагностика котла — поиск причины неисправности",
      },
      metaDescription: {
        uz: "Gaz va elektr kotyol diagnostikasi: xato kodlari, bosim, gorelka, plata va datchiklarni tekshirish. Ta’mir narxi ish boshlanishidan oldin aytiladi.",
        ru: "Диагностика газового и электрического котла: коды ошибок, давление, горелка, плата и датчики. Стоимость ремонта называем до начала работ.",
      },
      h1: { uz: "Kotyol diagnostikasi", ru: "Диагностика котла" },
      intro: {
        uz: "To‘g‘ri diagnostika — keraksiz qism almashtirishdan saqlaydi. Usta kotyolning barcha asosiy tugunlarini ketma-ket tekshiradi, xato kodini o‘qiydi va nosozlikning haqiqiy sababini topadi. Shundan so‘ng nima qilish kerakligi va qancha turishini tushuntiradi.",
        ru: "Правильная диагностика избавляет от лишней замены деталей. Мастер последовательно проверяет основные узлы котла, считывает код ошибки и находит настоящую причину неисправности. После этого объясняет, что нужно сделать и сколько это будет стоить.",
      },
      whatWeDo: {
        uz: [
          "Xato kodlari va ish jurnalini o‘qish",
          "Tizimdagi bosim va kengaytirish bakini tekshirish",
          "Gorelka, yoqish elektrodi va alanga datchigini tekshirish",
          "Nasos, uch yo‘lli klapan va datchiklarni o‘lchash",
          "Tutun chiqarish va havo kirish yo‘lini tekshirish",
          "Xulosa: nima nosoz, qanday tuzatiladi, qancha turadi",
        ],
        ru: [
          "Считывание кодов ошибок и журнала работы",
          "Проверка давления в системе и расширительного бака",
          "Проверка горелки, электрода розжига и датчика пламени",
          "Замеры насоса, трёхходового клапана и датчиков",
          "Проверка дымоудаления и подачи воздуха",
          "Заключение: что неисправно, как чинить и сколько стоит",
        ],
      },
      symptoms: {
        uz: [
          "Kotyol xato kodi berib, qayta ishga tushmayapti",
          "Gaz sarfi keskin oshib ketdi",
          "Kotyol notekis ishlayapti: gohida qizitadi, gohida yo‘q",
          "Boshqa ustadan keyin muammo qaytib chiqdi",
        ],
        ru: [
          "Котёл выдаёт ошибку и не перезапускается",
          "Резко вырос расход газа",
          "Котёл работает нестабильно: то греет, то нет",
          "Проблема вернулась после другого мастера",
        ],
      },
      faq: {
        uz: [
          {
            q: "Diagnostika qancha vaqt oladi?",
            a: "Ko‘pincha bir soatgacha. Murakkab holatlarda usta ko‘proq vaqt kerakligini oldindan aytadi.",
          },
        ],
        ru: [
          {
            q: "Сколько длится диагностика?",
            a: "Обычно до часа. В сложных случаях мастер заранее предупредит, что потребуется больше времени.",
          },
        ],
      },
    },
  },
  {
    id: "installation",
    icon: "install",
    featured: true,
    title: { uz: "Kotyol o‘rnatish", ru: "Установка котла" },
    short: {
      uz: "Uyga mos kotyol tanlashda yordam, montaj, ulash va birinchi ishga tushirish.",
      ru: "Поможем подобрать котёл, смонтируем, подключим и выполним первый запуск.",
    },
    slug: { uz: "kotyol-ornatish", ru: "ustanovka-kotla" },
    page: {
      metaTitle: {
        uz: "Kotyol o‘rnatish va almashtirish — montaj va ishga tushirish",
        ru: "Установка и замена котла — монтаж и запуск",
      },
      metaDescription: {
        uz: "Gaz va elektr kotyol o‘rnatish, eski kotyolni yangisiga almashtirish. Quvvat tanlash, montaj, isitish tizimiga ulash va sozlash.",
        ru: "Установка газового и электрического котла, замена старого котла на новый. Подбор мощности, монтаж, подключение к системе отопления и настройка.",
      },
      h1: { uz: "Kotyol o‘rnatish va almashtirish", ru: "Установка и замена котла" },
      intro: {
        uz: "Kotyolning uzoq va tejamkor ishlashi ko‘p jihatdan to‘g‘ri o‘rnatishga bog‘liq. Uy maydoni, xonalar soni va issiq suv ehtiyojiga qarab mos quvvatni tanlashga yordam beramiz, kotyolni o‘rnatamiz, isitish tizimiga ulaymiz va barcha rejimlarda sozlaymiz.",
        ru: "Долгая и экономичная работа котла во многом зависит от правильной установки. Поможем подобрать мощность по площади дома, количеству комнат и потребности в горячей воде, смонтируем котёл, подключим к системе отопления и настроим во всех режимах.",
      },
      whatWeDo: {
        uz: [
          "Uy va isitish tizimiga qarab kotyol quvvatini hisoblash",
          "Eski kotyolni demontaj qilish",
          "Kotyolni devorga yoki polga o‘rnatish",
          "Isitish va suv quvurlariga ulash, filtrlar o‘rnatish",
          "Tizimni to‘ldirish, havosini chiqarish, bosimni sozlash",
          "Birinchi ishga tushirish va foydalanishni tushuntirish",
        ],
        ru: [
          "Расчёт мощности котла под дом и систему отопления",
          "Демонтаж старого котла",
          "Монтаж настенного или напольного котла",
          "Подключение к отоплению и водоснабжению, установка фильтров",
          "Заполнение системы, удаление воздуха, настройка давления",
          "Первый запуск и инструктаж по эксплуатации",
        ],
      },
      symptoms: {
        uz: [
          "Yangi uy yoki ta’mirdan keyin isitish kerak",
          "Eski kotyol tez-tez buzilyapti va ta’mir foyda bermayapti",
          "Kotyol uyni yetarli qizdirmayapti",
          "Gazdan elektrga yoki aksincha o‘tmoqchisiz",
        ],
        ru: [
          "Нужно отопление в новом доме или после ремонта",
          "Старый котёл часто ломается и ремонт уже не помогает",
          "Котёл не справляется с обогревом дома",
          "Хотите перейти с газа на электричество или наоборот",
        ],
      },
      faq: {
        uz: [
          {
            q: "Kotyolni o‘zim sotib olsam, o‘rnatib berasizmi?",
            a: "Ha. Sotib olishdan oldin modelni ayting — uyingizga mos kelishini va o‘rnatish uchun nima kerakligini tekshirib beramiz.",
          },
          {
            q: "Gaz kotyolni ulash uchun ruxsat kerakmi?",
            a: "Gaz uskunasini ulash tartibi mahalliy gaz ta’minoti tashkiloti talablariga bog‘liq. Usta qaysi hujjatlar kerakligini tushuntirib beradi.",
          },
        ],
        ru: [
          {
            q: "Если я куплю котёл сам, вы его установите?",
            a: "Да. Назовите модель до покупки — проверим, подходит ли она вашему дому и что понадобится для монтажа.",
          },
          {
            q: "Нужно ли разрешение на подключение газового котла?",
            a: "Порядок подключения газового оборудования определяется требованиями местной газоснабжающей организации. Мастер подскажет, какие документы понадобятся.",
          },
        ],
      },
    },
  },
  {
    id: "maintenance",
    icon: "wrench",
    featured: true,
    title: { uz: "Texnik xizmat", ru: "Техобслуживание" },
    short: {
      uz: "Mavsumiy ko‘rik, tozalash va sozlash — kotyol qishda to‘satdan to‘xtab qolmasligi uchun.",
      ru: "Сезонный осмотр, чистка и настройка — чтобы котёл не остановился посреди зимы.",
    },
    slug: { uz: "kotyol-texnik-xizmat", ru: "obsluzhivanie-kotla" },
    page: {
      metaTitle: {
        uz: "Kotyolga texnik xizmat va tozalash — mavsumiy ko‘rik",
        ru: "Обслуживание и чистка котла — сезонный осмотр",
      },
      metaDescription: {
        uz: "Kotyolga texnik xizmat ko‘rsatish: gorelka va issiqlik almashtirgichni tozalash, bosim va xavfsizlik tizimlarini tekshirish. Qish oldidan mavsumiy ko‘rik.",
        ru: "Техническое обслуживание котла: чистка горелки и теплообменника, проверка давления и систем безопасности. Сезонный осмотр перед зимой.",
      },
      h1: { uz: "Kotyolga texnik xizmat ko‘rsatish", ru: "Техническое обслуживание котла" },
      intro: {
        uz: "Muntazam texnik xizmat kotyolning ishlash muddatini uzaytiradi, gaz sarfini kamaytiradi va qishda kutilmagan buzilishlar ehtimolini pasaytiradi. Isitish mavsumi boshlanishidan oldin ko‘rikdan o‘tkazish eng qulay vaqt.",
        ru: "Регулярное обслуживание продлевает срок службы котла, снижает расход газа и уменьшает риск внезапной поломки зимой. Лучшее время для осмотра — перед началом отопительного сезона.",
      },
      whatWeDo: {
        uz: [
          "Gorelka va issiqlik almashtirgichni tozalash",
          "Filtrlarni tozalash, kerak bo‘lsa almashtirish",
          "Kengaytirish bakidagi bosimni tekshirish va sozlash",
          "Xavfsizlik va avtomatika tizimlarini tekshirish",
          "Tutun chiqarish yo‘lini tekshirish",
          "Kotyolni tejamkor rejimga sozlash",
        ],
        ru: [
          "Чистка горелки и теплообменника",
          "Очистка фильтров, при необходимости замена",
          "Проверка и настройка давления в расширительном баке",
          "Проверка систем безопасности и автоматики",
          "Проверка дымоудаления",
          "Настройка котла на экономичный режим",
        ],
      },
      symptoms: {
        uz: [
          "Kotyol bir yildan ko‘proq ko‘rikdan o‘tmagan",
          "Isitish mavsumi yaqinlashyapti",
          "Gaz sarfi o‘tgan yilga nisbatan oshgan",
          "Issiq suv avvalgidan sekinroq qiziyapti",
        ],
        ru: [
          "Котёл не обслуживался больше года",
          "Приближается отопительный сезон",
          "Расход газа вырос по сравнению с прошлым годом",
          "Горячая вода греется медленнее, чем раньше",
        ],
      },
      faq: {
        uz: [
          {
            q: "Kotyolga qanchalik tez-tez xizmat ko‘rsatish kerak?",
            a: "Odatda yiliga bir marta, isitish mavsumidan oldin. Aniq muddat kotyol ishlab chiqaruvchisining ko‘rsatmasida yozilgan bo‘ladi.",
          },
        ],
        ru: [
          {
            q: "Как часто нужно обслуживать котёл?",
            a: "Как правило, раз в год перед отопительным сезоном. Точный интервал указан в инструкции производителя котла.",
          },
        ],
      },
    },
  },
  {
    id: "heating",
    icon: "radiator",
    featured: true,
    title: { uz: "Isitish tizimi", ru: "Система отопления" },
    short: {
      uz: "Radiatorlar, quvurlar, nasos va kengaytirish baki — montaj, ta’mir va sozlash.",
      ru: "Радиаторы, трубы, насос и расширительный бак — монтаж, ремонт и настройка.",
    },
    slug: { uz: "isitish-tizimi", ru: "otoplenie" },
    page: {
      metaTitle: {
        uz: "Isitish tizimi montaji va ta’mirlash — radiator, nasos, avtomatika",
        ru: "Монтаж и ремонт отопления — радиаторы, насосы, автоматика",
      },
      metaDescription: {
        uz: "Isitish tizimini o‘rnatish va ta’mirlash: radiator o‘rnatish, sirkulyatsiya nasosi va kengaytirish bakini almashtirish, tizimni yuvish va avtomatika.",
        ru: "Монтаж и ремонт системы отопления: установка радиаторов, замена циркуляционного насоса и расширительного бака, промывка системы, автоматика.",
      },
      h1: { uz: "Isitish tizimini o‘rnatish va ta’mirlash", ru: "Монтаж и ремонт системы отопления" },
      intro: {
        uz: "Hatto yaxshi kotyol ham noto‘g‘ri yig‘ilgan tizimda uyni bir tekis isita olmaydi. Radiatorlar, quvurlar, nasos va avtomatikani bitta tizim sifatida ko‘rib chiqamiz: ba’zi xonalar sovuq qolsa, bosim tushsa yoki tizim shovqin qilsa — sababini topib, tuzatamiz.",
        ru: "Даже хороший котёл не прогреет дом равномерно, если система собрана неправильно. Рассматриваем радиаторы, трубы, насос и автоматику как единую систему: если часть комнат холодная, падает давление или система шумит — находим причину и устраняем.",
      },
      whatWeDo: {
        uz: [
          "Radiatorlarni o‘rnatish va almashtirish",
          "Sirkulyatsiya nasosini almashtirish",
          "Kengaytirish bakini almashtirish va sozlash",
          "Tizimni yuvish va havosini chiqarish",
          "Xona termostati va isitish avtomatikasini o‘rnatish",
          "Oqishlarni bartaraf etish va quvurlarni almashtirish",
        ],
        ru: [
          "Установка и замена радиаторов",
          "Замена циркуляционного насоса",
          "Замена и настройка расширительного бака",
          "Промывка системы и удаление воздуха",
          "Установка комнатного термостата и автоматики отопления",
          "Устранение протечек и замена участков труб",
        ],
      },
      symptoms: {
        uz: [
          "Ba’zi radiatorlar sovuq yoki faqat yuqorisi issiq",
          "Tizimda shovqin, bulduqlash ovozi eshitilyapti",
          "Bosim tez-tez tushib ketyapti",
          "Yangi xona yoki qavat qo‘shildi",
        ],
        ru: [
          "Часть радиаторов холодная или греется только верх",
          "В системе шум и бульканье",
          "Постоянно падает давление",
          "Добавилась новая комната или этаж",
        ],
      },
      faq: {
        uz: [
          {
            q: "Radiator nega yarim qiziydi?",
            a: "Ko‘pincha sabab — radiatorda havo to‘planishi, tizim ifloslanishi yoki nasosning kuchsizligi. Usta aniq sababni tekshirib topadi.",
          },
        ],
        ru: [
          {
            q: "Почему батарея греется наполовину?",
            a: "Чаще всего причина — воздух в радиаторе, загрязнение системы или слабый насос. Мастер найдёт точную причину на месте.",
          },
        ],
      },
    },
  },
  {
    id: "flush",
    icon: "drop",
    featured: true,
    title: { uz: "Isitish tizimini yuvish", ru: "Промывка системы отопления" },
    short: {
      uz: "Radiatorlar sovuq, tizim shovqin qilyapti — quvur va radiatorlardagi quyqa hamda loyqani yuvib tashlaymiz.",
      ru: "Батареи холодные, система шумит — вымываем накипь и грязь из труб и радиаторов.",
    },
    slug: { uz: "isitish-tizimini-yuvish", ru: "promyvka-sistemy-otopleniya" },
    page: {
      metaTitle: {
        uz: "Isitish tizimini yuvish (promivka) — radiator va quvurlarni tozalash",
        ru: "Промывка системы отопления — очистка радиаторов и труб",
      },
      metaDescription: {
        uz: "Isitish tizimini kimyoviy va gidrodinamik yuvish: quyqa, zang va loyqani chiqarish. Radiatorlar bir tekis qiziydi, gaz sarfi kamayadi. Usta uyga chiqadi.",
        ru: "Химическая и гидродинамическая промывка системы отопления: удаляем накипь, ржавчину и грязь. Батареи греют равномерно, расход газа падает. Выезд мастера.",
      },
      h1: { uz: "Isitish tizimini yuvish", ru: "Промывка системы отопления" },
      intro: {
        uz: "Yillar davomida quvurlar ichida quyqa, zang va loyqa to‘planadi. Natijada issiq suv erkin aylanmaydi: ba’zi radiatorlar sovuq qoladi, kotyol ortiqcha ishlaydi va gaz sarfi oshadi. Yuvish — tizimni almashtirmasdan uning ish qobiliyatini tiklashning eng arzon yo‘li. Tizim holatiga qarab kimyoviy yoki gidrodinamik usulni tanlaymiz.",
        ru: "За годы внутри труб накапливается накипь, ржавчина и ил. Горячая вода перестаёт свободно циркулировать: часть радиаторов остаётся холодной, котёл работает с перегрузкой, растёт расход газа. Промывка — самый недорогой способ вернуть системе работоспособность без её замены. В зависимости от состояния выбираем химический или гидродинамический метод.",
      },
      whatWeDo: {
        uz: [
          "Tizim holatini tekshirish va yuvish usulini tanlash",
          "Kimyoviy yuvish: maxsus reagent bilan quyqa va zangni eritish",
          "Gidrodinamik yuvish: bosimli suv bilan loyqani chiqarish",
          "Har bir radiatorni alohida tekshirish va yuvish",
          "Tizimni toza suv bilan chayish va to‘ldirish",
          "Havosini chiqarish, bosimni sozlash va sinovdan o‘tkazish",
        ],
        ru: [
          "Диагностика состояния системы и выбор метода промывки",
          "Химическая промывка: реагент растворяет накипь и ржавчину",
          "Гидродинамическая промывка: грязь выбивается напором воды",
          "Проверка и промывка каждого радиатора отдельно",
          "Промывка чистой водой и заполнение системы",
          "Удаление воздуха, настройка давления и проверка под нагрузкой",
        ],
      },
      symptoms: {
        uz: [
          "Ba’zi radiatorlar sovuq yoki faqat yuqori qismi qiziydi",
          "Quvurlarda shovqin, bulduqlash eshitiladi",
          "Uy sekin qiziydi, gaz sarfi esa oshgan",
          "Tizim 5 yildan beri yuvilmagan",
          "Kotyol tez-tez qizib ketib o‘chadi",
        ],
        ru: [
          "Часть батарей холодная или греется только сверху",
          "В трубах слышен шум и бульканье",
          "Дом прогревается медленно, а газа уходит больше",
          "Систему не промывали более 5 лет",
          "Котёл часто уходит в перегрев",
        ],
      },
      faq: {
        uz: [
          {
            q: "Yuvish qancha vaqt oladi?",
            a: "Ko‘pincha bir kun ichida bajariladi. Aniq muddat tizim hajmi, radiatorlar soni va ifloslanish darajasiga bog‘liq — usta ko‘rikdan so‘ng aytadi.",
          },
          {
            q: "Yuvish quvurlarga zarar bermaydimi?",
            a: "Reagent quvur materialiga qarab tanlanadi. Juda eskirgan, zanglab yemirilgan quvurlarda usta buni oldindan ogohlantiradi va almashtirishni tavsiya qiladi.",
          },
        ],
        ru: [
          {
            q: "Сколько времени занимает промывка?",
            a: "Обычно выполняется за один день. Точный срок зависит от объёма системы, количества радиаторов и степени загрязнения — мастер скажет после осмотра.",
          },
          {
            q: "Не повредит ли промывка трубы?",
            a: "Реагент подбирается под материал труб. Если трубы сильно изношены ржавчиной, мастер предупредит об этом заранее и порекомендует замену.",
          },
        ],
      },
    },
  },
  {
    id: "boiler-flush",
    icon: "tank",
    featured: true,
    title: { uz: "Kotyolni kimyoviy yuvish", ru: "Промывка котла" },
    short: {
      uz: "Issiqlik almashtirgichdagi quyqa kotyolni qizib ketishga olib keladi — reagent bilan tozalaymiz.",
      ru: "Накипь в теплообменнике ведёт к перегреву котла — очищаем реагентом.",
    },
    slug: { uz: "kotyolni-yuvish", ru: "promyvka-kotla" },
    page: {
      metaTitle: {
        uz: "Kotyolni kimyoviy yuvish — issiqlik almashtirgichni quyqadan tozalash",
        ru: "Промывка котла и теплообменника от накипи",
      },
      metaDescription: {
        uz: "Kotyol issiqlik almashtirgichini kimyoviy yuvish: quyqa va zangni chiqarish, issiq suv bosimini tiklash, gaz sarfini kamaytirish. Gaz va elektr kotyollar.",
        ru: "Химическая промывка теплообменника котла: удаление накипи и ржавчины, восстановление напора горячей воды, снижение расхода газа. Газовые и электрические котлы.",
      },
      h1: { uz: "Kotyolni kimyoviy yuvish", ru: "Промывка котла и теплообменника" },
      intro: {
        uz: "Suvdagi tuzlar issiqlik almashtirgich devorlarida quyqa bo‘lib qotadi. Bir millimetr quyqa issiqlik uzatishni sezilarli pasaytiradi: kotyol ko‘proq yoqilg‘i sarflaydi, qizib ketadi va xato kodlari chiqara boshlaydi. Kimyoviy yuvish quyqani eritib chiqaradi va kotyolni almashtirishni bir necha yilga kechiktiradi.",
        ru: "Соли из воды оседают на стенках теплообменника и превращаются в накипь. Даже миллиметр накипи заметно снижает теплопередачу: котёл жжёт больше топлива, перегревается и начинает выдавать ошибки. Химическая промывка растворяет накипь и откладывает замену котла на несколько лет.",
      },
      whatWeDo: {
        uz: [
          "Kotyolni ochish va ifloslanish darajasini baholash",
          "Ikkilamchi issiqlik almashtirgichni reagent bilan yuvish (bustеr nasos orqali)",
          "Filtr va suv tarmog‘idagi to‘siqlarni tozalash",
          "Zichlagichlarni tekshirish, kerak bo‘lsa almashtirish",
          "Tizimni chayish va kotyolni qayta yig‘ish",
          "Issiq suv harorati va bosimini o‘lchab sinovdan o‘tkazish",
        ],
        ru: [
          "Вскрытие котла и оценка степени загрязнения",
          "Промывка вторичного теплообменника реагентом (бустерным насосом)",
          "Очистка фильтров и проходов водяного контура",
          "Проверка уплотнений, при необходимости замена",
          "Ополаскивание контура и обратная сборка котла",
          "Контрольный замер температуры и напора горячей воды",
        ],
      },
      symptoms: {
        uz: [
          "Issiq suv kuchsiz oqyapti yoki tez sovib qolyapti",
          "Kotyol qizib ketish xatosini berib o‘chadi",
          "Isitish ishlayapti, lekin issiq suv yo‘q",
          "Kotyol ichidan shovqin, sharillash eshitiladi",
          "Gaz sarfi o‘tgan yilga nisbatan oshgan",
        ],
        ru: [
          "Горячая вода идёт слабым напором или быстро остывает",
          "Котёл отключается по ошибке перегрева",
          "Отопление работает, а горячей воды нет",
          "Из котла слышен шум и журчание",
          "Расход газа вырос по сравнению с прошлым годом",
        ],
      },
      faq: {
        uz: [
          {
            q: "Kotyolni qanchalik tez-tez yuvish kerak?",
            a: "Suv qattiqligiga bog‘liq. Toshkent sharoitida odatda 1–2 yilda bir marta tavsiya etiladi, filtr yoki yumshatgich o‘rnatilgan bo‘lsa kamroq.",
          },
          {
            q: "Yuvish o‘rniga almashtirish kerakmi?",
            a: "Issiqlik almashtirgich teshilib oqmagan bo‘lsa, yuvish yetarli. Usta diagnostikadan so‘ng qaysi biri foydali ekanini aytadi.",
          },
        ],
        ru: [
          {
            q: "Как часто нужно промывать котёл?",
            a: "Зависит от жёсткости воды. В условиях Ташкента обычно рекомендуется раз в 1–2 года, при наличии фильтра или умягчителя — реже.",
          },
          {
            q: "Может, лучше заменить, а не промывать?",
            a: "Если теплообменник не прогорел и не течёт, промывки достаточно. После диагностики мастер скажет, что выгоднее.",
          },
        ],
      },
    },
  },
  {
    id: "boyler",
    icon: "drop",
    featured: true,
    title: { uz: "Boyler tozalash", ru: "Чистка бойлера" },
    short: {
      uz: "Suv isitgichni quyqadan tozalash, TENni va magniy anodni almashtirish.",
      ru: "Очистка водонагревателя от накипи, замена ТЭНа и магниевого анода.",
    },
    slug: { uz: "boyler-tozalash", ru: "chistka-boylera" },
    page: {
      metaTitle: {
        uz: "Boyler tozalash va ta’mirlash — suv isitgichni quyqadan tozalash",
        ru: "Чистка и ремонт бойлера — удаление накипи из водонагревателя",
      },
      metaDescription: {
        uz: "Boyler (suv isitgich) tozalash: quyqani chiqarish, TEN va magniy anodni almashtirish, termostatni tekshirish. Usta uyga chiqadi, kafolat bilan.",
        ru: "Чистка бойлера (водонагревателя): удаление накипи, замена ТЭНа и магниевого анода, проверка термостата. Выезд мастера, гарантия на работу.",
      },
      h1: { uz: "Boyler tozalash va ta’mirlash", ru: "Чистка и ремонт бойлера" },
      intro: {
        uz: "Boyler ichida quyqa TEN ustida qalin qatlam hosil qiladi: suv sekin qiziydi, elektr sarfi oshadi va TEN kuyib ketadi. Magniy anod esa bakni zangdan himoya qiladi va vaqti-vaqti bilan almashtirilishi kerak. Muntazam tozalash boylerning ishlash muddatini bir necha barobar uzaytiradi.",
        ru: "Внутри бойлера накипь нарастает на ТЭНе: вода греется медленнее, растёт расход электричества, ТЭН перегорает. Магниевый анод защищает бак от ржавчины и его нужно периодически менять. Регулярная чистка продлевает срок службы бойлера в несколько раз.",
      },
      whatWeDo: {
        uz: [
          "Boylerni suvdan bo‘shatish va ochish",
          "Bak ichini va TENni quyqadan mexanik hamda kimyoviy tozalash",
          "Magniy anod holatini tekshirish va almashtirish",
          "TEN va termostatni o‘lchab tekshirish, kerak bo‘lsa almashtirish",
          "Zichlagichni almashtirib, germetikligini tekshirish",
          "To‘ldirish, isitishni sinab ko‘rish va haroratni sozlash",
        ],
        ru: [
          "Слив воды и вскрытие бойлера",
          "Механическая и химическая очистка бака и ТЭНа от накипи",
          "Проверка и замена магниевого анода",
          "Замер ТЭНа и термостата, замена при необходимости",
          "Замена уплотнения и проверка на герметичность",
          "Заполнение, пробный нагрев и настройка температуры",
        ],
      },
      symptoms: {
        uz: [
          "Suv sekin qiziydi yoki umuman qizimayapti",
          "Boylerdan shovqin, taqillash eshitiladi",
          "Suvda zang hidi yoki rangi paydo bo‘lgan",
          "Elektr sarfi sezilarli oshgan",
          "Boyler 1–2 yildan beri tozalanmagan",
        ],
        ru: [
          "Вода греется медленно или не греется вовсе",
          "Бойлер шумит, слышны щелчки",
          "У воды появился запах или цвет ржавчины",
          "Заметно вырос расход электричества",
          "Бойлер не чистили 1–2 года",
        ],
      },
      faq: {
        uz: [
          {
            q: "Boylerni qancha vaqtda bir tozalash kerak?",
            a: "Odatda yiliga bir marta. Suv qattiq bo‘lgan joylarda ko‘proq kerak bo‘lishi mumkin — usta anod holatiga qarab aytadi.",
          },
        ],
        ru: [
          {
            q: "Как часто чистить бойлер?",
            a: "Обычно раз в год. При жёсткой воде может потребоваться чаще — мастер скажет по состоянию анода.",
          },
        ],
      },
    },
  },
  {
    id: "emergency",
    icon: "alert",
    featured: true,
    title: { uz: "Tezkor yordam", ru: "Срочный выезд" },
    short: {
      uz: "Kotyol to‘xtab qoldi, uy soviyapti yoki suv oqyapti — imkon qadar tez yetib boramiz.",
      ru: "Котёл встал, дом остывает или течёт вода — приедем как можно быстрее.",
    },
    slug: null,
  },
  {
    id: "gas-repair",
    icon: "gas",
    featured: false,
    title: { uz: "Gaz kotyol ta’mirlash", ru: "Ремонт газового котла" },
    short: {
      uz: "Devorga osiladigan va polga qo‘yiladigan gaz kotyollarni ta’mirlash.",
      ru: "Ремонт настенных и напольных газовых котлов.",
    },
    slug: { uz: "gaz-kotyol-tamirlash", ru: "remont-gazovogo-kotla" },
    page: {
      metaTitle: {
        uz: "Gaz kotyol ta’mirlash — gorelka, yoqish, avtomatika",
        ru: "Ремонт газового котла — горелка, розжиг, автоматика",
      },
      metaDescription: {
        uz: "Gaz kotyol ta’mirlash: yoqilmaslik, alanga o‘chishi, gaz klapani va gorelka nosozliklari, xato kodlari. Kotyol ustasi uyga chiqadi.",
        ru: "Ремонт газового котла: не разжигается, гаснет пламя, неисправности газового клапана и горелки, коды ошибок. Выезд мастера на дом.",
      },
      h1: { uz: "Gaz kotyol ta’mirlash", ru: "Ремонт газовых котлов" },
      intro: {
        uz: "Gaz kotyol — xavfsizlik talab qiladigan uskuna, shuning uchun uni o‘zingiz ochib ta’mirlashga urinmang. Usta yoqish tizimi, gaz klapani, alanga nazorati va tutun chiqarish yo‘lini tekshiradi, nosozlikni bartaraf etib, kotyolni xavfsiz ishlaydigan holatga keltiradi.",
        ru: "Газовый котёл — оборудование, требующее соблюдения мер безопасности, поэтому не пытайтесь вскрывать и чинить его самостоятельно. Мастер проверит розжиг, газовый клапан, контроль пламени и дымоудаление, устранит неисправность и вернёт котлу безопасную работу.",
      },
      whatWeDo: {
        uz: [
          "Yoqish elektrodi va alanga datchigini tekshirish, almashtirish",
          "Gaz klapanini tekshirish va sozlash",
          "Gorelkani tozalash va yonishni sozlash",
          "Tutun chiqarish va ventilyatorni tekshirish",
          "Xavfsizlik datchiklarini tekshirish",
        ],
        ru: [
          "Проверка и замена электрода розжига и датчика пламени",
          "Проверка и настройка газового клапана",
          "Чистка горелки и настройка горения",
          "Проверка дымоудаления и вентилятора",
          "Проверка датчиков безопасности",
        ],
      },
      symptoms: {
        uz: [
          "Kotyol yoqishga urinadi, lekin alanga chiqmaydi",
          "Alanga yonib, bir necha soniyada o‘chadi",
          "Yoqilishda qattiq “pax” ovozi chiqadi",
          "Tutun yoki gaz hidi sezilyapti — darhol gazni yoping va 104 ga qo‘ng‘iroq qiling",
        ],
        ru: [
          "Котёл пытается разжечься, но пламени нет",
          "Пламя загорается и через несколько секунд гаснет",
          "При розжиге слышен громкий хлопок",
          "Чувствуется запах газа или дыма — сразу перекройте газ и звоните 104",
        ],
      },
      faq: {
        uz: [
          {
            q: "Gaz hidi kelsa nima qilish kerak?",
            a: "Gaz kranini yoping, elektr jihozlarini yoqmang va o‘chirmang, derazalarni oching, xonadan chiqing va gaz avariya xizmatiga (104) qo‘ng‘iroq qiling. Ta’mirni faqat xavf bartaraf etilgandan keyin boshlash mumkin.",
          },
        ],
        ru: [
          {
            q: "Что делать при запахе газа?",
            a: "Перекройте газовый кран, не включайте и не выключайте электроприборы, откройте окна, выйдите из помещения и позвоните в аварийную газовую службу (104). Ремонт возможен только после устранения опасности.",
          },
        ],
      },
    },
  },
];

/** Barcha ishlar to'liq ro'yxati (bosh sahifadagi ixcham ro'yxat uchun) */
export const allWorks: LL = {
  uz: [
    "Kotyol ta’mirlash",
    "Gaz kotyolga xizmat ko‘rsatish",
    "Elektr kotyolga xizmat ko‘rsatish",
    "Isitish kotyolini o‘rnatish",
    "Kotyol diagnostikasi",
    "Kotyolga texnik xizmat",
    "Kotyolni tozalash",
    "Kotyolni kimyoviy yuvish",
    "Issiqlik almashtirgichni tozalash",
    "Isitish tizimini yuvish (promivka)",
    "Radiatorlarni yuvish",
    "Boyler (suv isitgich) tozalash",
    "Kotyolni almashtirish",
    "Isitish tizimini o‘rnatish",
    "Isitish tizimini ta’mirlash",
    "Radiator o‘rnatish",
    "Sirkulyatsiya nasosini almashtirish",
    "Kengaytirish bakini almashtirish",
    "Isitish avtomatikasi",
    "Tezkor chaqiruv",
    "Mavsumiy ko‘rik",
  ],
  ru: [
    "Ремонт котлов",
    "Обслуживание газовых котлов",
    "Обслуживание электрокотлов",
    "Установка котла отопления",
    "Диагностика котла",
    "Техобслуживание котла",
    "Чистка котла",
    "Химическая промывка котла",
    "Очистка теплообменника",
    "Промывка системы отопления",
    "Промывка радиаторов",
    "Чистка бойлера (водонагревателя)",
    "Замена котла",
    "Монтаж системы отопления",
    "Ремонт системы отопления",
    "Установка радиаторов",
    "Замена циркуляционного насоса",
    "Замена расширительного бака",
    "Автоматика отопления",
    "Срочный вызов",
    "Сезонный осмотр котла",
  ],
};

/** Formadagi "Xizmat turi" variantlari */
export const requestServiceOptions: { id: string; label: L }[] = [
  { id: "repair", label: { uz: "Kotyol ta’mirlash", ru: "Ремонт котла" } },
  { id: "diagnostics", label: { uz: "Diagnostika", ru: "Диагностика" } },
  { id: "installation", label: { uz: "Kotyol o‘rnatish / almashtirish", ru: "Установка / замена котла" } },
  { id: "maintenance", label: { uz: "Texnik xizmat / tozalash", ru: "Обслуживание / чистка" } },
  { id: "flush", label: { uz: "Isitish tizimini yuvish", ru: "Промывка системы отопления" } },
  { id: "boiler-flush", label: { uz: "Kotyolni yuvish", ru: "Промывка котла" } },
  { id: "boyler", label: { uz: "Boyler tozalash", ru: "Чистка бойлера" } },
  { id: "heating", label: { uz: "Isitish tizimi / radiatorlar", ru: "Отопление / радиаторы" } },
  { id: "emergency", label: { uz: "Tezkor chaqiruv", ru: "Срочный вызов" } },
  { id: "other", label: { uz: "Boshqa", ru: "Другое" } },
];

export const serviceOptionIds = requestServiceOptions.map((o) => o.id);

/* ---------- helpers ---------- */
export const servicePages = services.filter((s) => s.slug && s.page);

export function findServiceBySlug(lang: Lang, slug: string) {
  return servicePages.find((s) => s.slug![lang] === slug);
}

/** Til almashtirganda xizmat sahifasining boshqa tildagi manzili */
export function translateServicePath(path: string, to: Lang): string | null {
  const m = path.match(/^\/(uz|ru)\/services\/([^/?#]+)/);
  if (!m) return null;
  const from = m[1] as Lang;
  const svc = servicePages.find((s) => s.slug![from] === m[2]);
  return svc ? `/${to}/services/${svc.slug![to]}` : `/${to}`;
}
