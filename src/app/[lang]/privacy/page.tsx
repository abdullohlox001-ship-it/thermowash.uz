import type { Metadata } from "next";
import { isLang, type Lang } from "@/lib/i18n";
import { business, phoneDisplay, phoneHref } from "@/config/business";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata({
    lang,
    title: lang === "uz" ? `Maxfiylik siyosati | ${business.name.uz}` : `Политика конфиденциальности | ${business.name.ru}`,
    description: lang === "uz" ? "Saytdagi ariza orqali yuborilgan shaxsiy ma’lumotlar qanday ishlatilishi haqida." : "Как используются персональные данные, отправленные через заявку на сайте.",
    paths: { uz: "/privacy", ru: "/privacy" },
  });
}

const content: Record<Lang, { h1: string; blocks: [string, string][] }> = {
  uz: {
    h1: "Maxfiylik siyosati",
    blocks: [
      ["Qanday ma’lumot yig‘amiz", "Ariza formasi orqali siz yuborgan ma’lumotlar: ism, telefon raqami, xizmat turi, muammo tavsifi va (ixtiyoriy) hudud yoki manzil. Shuningdek, arizaning yuborilgan vaqti, sayt tili va sahifa manzili saqlanadi."],
      ["Nima uchun", "Ma’lumotlar faqat siz bilan bog‘lanish, arizangizni ko‘rib chiqish va xizmat ko‘rsatish uchun ishlatiladi. Biz ularni sotmaymiz va reklama maqsadida uchinchi shaxslarga bermaymiz."],
      ["Qayerda saqlanadi", "Ariza xodimlarimizning ishchi Telegram chatiga yuboriladi va xizmat serverida zaxira nusxa sifatida saqlanishi mumkin. Spamdan himoya uchun IP-manzilning qaytarib bo‘lmaydigan xeshi ishlatiladi."],
      ["Analitika", "Sayt ishlashini yaxshilash uchun anonim statistika xizmatlari (masalan, Google Analytics) ishlatilishi mumkin. Ular cookie fayllaridan foydalanadi; brauzer sozlamalarida ularni o‘chirib qo‘yishingiz mumkin."],
      ["Ma’lumotlarni o‘chirish", "Ma’lumotlaringizni o‘chirishni so‘rash uchun biz bilan telefon orqali bog‘laning."],
    ],
  },
  ru: {
    h1: "Политика конфиденциальности",
    blocks: [
      ["Какие данные мы собираем", "Данные, которые вы отправляете через форму заявки: имя, номер телефона, вид услуги, описание проблемы и (по желанию) район или адрес. Также сохраняются время отправки, язык сайта и адрес страницы."],
      ["Для чего", "Данные используются только для связи с вами, обработки заявки и оказания услуги. Мы не продаём их и не передаём третьим лицам в рекламных целях."],
      ["Где хранятся", "Заявка отправляется в рабочий Telegram-чат наших сотрудников и может храниться на сервере в виде резервной копии. Для защиты от спама используется необратимый хеш IP-адреса."],
      ["Аналитика", "Для улучшения работы сайта могут использоваться сервисы анонимной статистики (например, Google Analytics). Они используют cookie; вы можете отключить их в настройках браузера."],
      ["Удаление данных", "Чтобы запросить удаление ваших данных, свяжитесь с нами по телефону."],
    ],
  },
};

export default async function Privacy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = l as Lang;
  const c = content[lang];
  return (
    <article className="wrap section max-w-3xl">
      <h1 className="h2">{c.h1}</h1>
      <div className="mt-8 space-y-8">
        {c.blocks.map(([h, p]) => (
          <section key={h}>
            <h2 className="text-xl font-bold">{h}</h2>
            <p className="mt-2 leading-relaxed text-ink-700">{p}</p>
          </section>
        ))}
        <p className="border-t border-line pt-6 text-ink-700">
          {business.name[lang]} — <a href={phoneHref} className="font-bold text-ink-900 underline">{phoneDisplay}</a>
        </p>
      </div>
    </article>
  );
}
