import { RequestButton } from "../RequestModal";
import { FormIcon, PhoneIcon } from "../Icons";
import { phoneDisplay, phoneHref } from "@/config/business";
import type { Dict } from "@/lib/i18n";

export default function EmergencyCTA({ t }: { t: Dict }) {
  return (
    <section data-section="emergency" className="bg-flame-500 text-ink-950" aria-labelledby="emg-h">
      <div className="wrap grid gap-8 py-14 md:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 id="emg-h" className="text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] md:text-5xl">{t.sections.emergencyTitle}</h2>
          <p className="mt-3 text-lg font-medium md:text-xl">{t.sections.emergencyText}</p>
          <a href={phoneHref} className="mt-5 inline-block text-2xl font-extrabold tracking-tight underline decoration-2 underline-offset-[6px] md:text-3xl">
            {phoneDisplay}
          </a>
        </div>
        <div className="grid gap-3 sm:flex lg:grid">
          <a href={phoneHref} className="btn h-14 bg-ink-950 px-7 text-[1.05rem] text-white hover:bg-ink-800">
            <PhoneIcon size={21} strokeWidth={2.2} />
            {t.cta.callNow}
          </a>
          <RequestButton placement="emergency" service="emergency" className="btn h-14 border-2 border-ink-950 px-7 text-[1.05rem] hover:bg-ink-950 hover:text-white">
            <FormIcon size={21} />
            {t.cta.request}
          </RequestButton>
        </div>
      </div>
    </section>
  );
}
