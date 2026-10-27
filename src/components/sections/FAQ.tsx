import { ChevronIcon } from "../Icons";
import type { Dict } from "@/lib/i18n";

export default function FAQ({ t, items, id = "faq", title }: { t: Dict; items: { q: string; a: string }[]; id?: string; title?: string }) {
  return (
    <section id={id} data-section="faq" className="section bg-paper" aria-labelledby={`${id}-h`}>
      <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <h2 id={`${id}-h`} className="h2 max-w-[14ch]">{title ?? t.sections.faqTitle}</h2>
        <div className="border-t border-line">
          {items.map((f, i) => (
            <details key={i} className="faq group border-b border-line" name={id}>
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-4 text-left text-[1.08rem] font-bold leading-snug text-ink-900 hover:text-flame-700">
                <h3>{f.q}</h3>
                <ChevronIcon size={22} className="faq-icon shrink-0 text-ink-600 transition-transform" />
              </summary>
              <div className="faq-body max-w-[64ch] pb-5 pr-8 leading-relaxed text-ink-700">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
