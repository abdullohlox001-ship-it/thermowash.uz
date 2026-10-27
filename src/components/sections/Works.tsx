import Image from "next/image";
import { RequestButton } from "../RequestModal";
import { works, hasWorks } from "@/content/media";
import type { Dict, Lang } from "@/lib/i18n";

export default function Works({ lang, t }: { lang: Lang; t: Dict }) {
  const dev = process.env.NODE_ENV !== "production";
  if (!hasWorks && !dev) return null;

  return (
    <section id="works" data-section="works" className="section border-t border-line bg-white" aria-labelledby="works-h">
      <div className="wrap">
        <h2 id="works-h" className="h2">{t.sections.worksTitle}</h2>
        <p className="lead">{t.sections.worksLead}</p>

        {hasWorks ? (
          <>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {works.map((w, i) => (
                <li key={w.src} className="overflow-hidden rounded-lg border border-line bg-paper">
                  <div className="relative aspect-[4/3] bg-ink-800">
                    <Image
                      src={w.src}
                      alt={w.alt[lang]}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                      loading={i < 3 ? "eager" : "lazy"}
                    />
                  </div>
                  {w.caption && <p className="px-4 py-3 text-sm font-semibold text-ink-800">{w.caption[lang]}</p>}
                </li>
              ))}
            </ul>
            <RequestButton placement="works" className="btn-outline mt-8 h-12 px-6">
              {t.cta.orderMaster}
            </RequestButton>
          </>
        ) : (
          <div className="mt-8 rounded-lg border-2 border-dashed border-flame-500 bg-paper p-6 text-sm text-ink-700">
            <strong className="text-flame-700">[EDITABLE — faqat dev rejimida ko‘rinadi]</strong>
            <br />
            Ish rasmlarini <code className="rounded bg-white px-1">public/images/works/</code> ga tashlang va{" "}
            <code className="rounded bg-white px-1">src/content/media.ts → works</code> ro‘yxatiga yozing.
            Ro‘yxat bo‘sh bo‘lsa, productionda bu bo‘lim va menyudagi havola avtomatik yashiriladi.
          </div>
        )}
      </div>
    </section>
  );
}
