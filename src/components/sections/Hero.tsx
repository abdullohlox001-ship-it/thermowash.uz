import Image from "next/image";
import { RequestButton } from "../RequestModal";
import { heroPhoto } from "@/content/media";
import { ArrowIcon, CheckIcon, DropIcon, FlameIcon, FormIcon, PhoneIcon, PinIcon, TankIcon, TelegramIcon } from "../Icons";
import type { Dict, Lang } from "@/lib/i18n";
import { business, phone2Display, phone2Href, phoneDisplay, phoneHref, telegramHref } from "@/config/business";

export default function Hero({ lang, t }: { lang: Lang; t: Dict }) {
  const trust = t.trust.map((x, i) =>
    i === 0 && business.experienceYears ? t.experience(business.experienceYears, business.experiencePlus) : i === 1 ? t.warranty(business.warrantyMonths) : x,
  );
  const locLine = lang === "uz" ? `${business.city.uz}da kotyol ustasi xizmati` : `Мастер по котлам в ${cityPrepositional(business.city.ru)}`;

  return (
    <section data-section="hero" className={`relative overflow-hidden bg-ink-900 text-white ${heroPhoto ? "" : "blueprint"}`}>
      {!heroPhoto && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 hidden h-[130%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(38,140,220,0.22),transparent)] lg:block"
        />
      )}
      {heroPhoto && (
        <>
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt[lang]}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 object-cover object-[70%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/85 to-ink-950/95 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/90 lg:to-ink-950/25"
          />
        </>
      )}
      <div className={`relative wrap grid gap-10 pb-12 pt-8 md:pb-16 md:pt-14 lg:items-center lg:gap-14 lg:pb-24 lg:pt-20 ${heroPhoto ? "" : "lg:grid-cols-[1.15fr_0.85fr]"}`}>
        <div className={`hero-in ${heroPhoto ? "max-w-[760px]" : ""}`}>
          <p className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-300">
            <PinIcon size={16} className="text-flame-400" />
            {locLine}
          </p>

          <h1 className="max-w-[20ch] text-[2.05rem] font-extrabold leading-[1.06] tracking-[-0.025em] sm:text-[2.6rem] md:text-[3.3rem] lg:text-[3.6rem]">
            {t.hero.title}
          </h1>

          <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-300 md:mt-5 md:text-lg">{t.hero.text}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {t.hero.pills.map((label, i) => {
              const Icon = [FlameIcon, DropIcon, TankIcon][i] ?? FlameIcon;
              return (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800/60 py-2 pl-3 pr-3.5 text-[0.92rem] font-semibold text-white backdrop-blur-sm"
                >
                  <Icon size={17} className={i === 0 ? "text-flame-400" : "text-[#49B6F0]"} />
                  {label}
                </li>
              );
            })}
          </ul>

          {business.promo && (
            <p className="mt-5 inline-flex items-center gap-2 rounded border border-flame-500/60 bg-flame-500/10 px-3.5 py-2 text-[0.95rem] font-bold text-flame-400">
              {business.promo[lang]}
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <a href={phoneHref} className="btn-primary h-14 px-7 text-[1.05rem]">
              <PhoneIcon size={21} strokeWidth={2.2} />
              {t.cta.call}
            </a>
            <RequestButton placement="hero" className="btn-ghost-light h-14 px-7 text-[1.05rem]">
              <FormIcon size={21} />
              {t.cta.request}
            </RequestButton>
          </div>

          {telegramHref && (
            <a href={telegramHref} target="_blank" rel="noopener" className="mt-4 flex w-fit min-h-[44px] items-center gap-2 text-[0.98rem] font-semibold text-ink-300 underline-offset-4 hover:text-white hover:underline">
              <TelegramIcon size={19} className="text-flame-400" />
              {t.cta.telegram}
            </a>
          )}

          <a href={phoneHref} className="group mt-4 flex w-fit flex-col">
            <span className="text-sm text-ink-400">{business.workingHours.label[lang]}</span>
            <span className="mt-0.5 text-[1.7rem] font-extrabold tracking-tight text-white group-hover:text-flame-400 md:text-3xl">
              {phoneDisplay}
            </span>
          </a>
          {phone2Href && (
            <a href={phone2Href} className="mt-1 flex w-fit text-lg font-bold tracking-tight text-ink-300 hover:text-flame-400">
              {phone2Display}
            </a>
          )}

          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-ink-700 pt-6 sm:grid-cols-3">
            {trust.map((x) => (
              <li key={x} className="flex items-start gap-2 text-[0.95rem] font-medium leading-snug text-white">
                <CheckIcon size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-flame-400" />
                {x}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-ink-700 bg-ink-800/50 p-4 lg:hidden">
            <PipeCompare t={t} className="mx-auto max-w-[320px]" />
          </div>
        </div>

        {!heroPhoto && <BoilerPanel t={t} />}
      </div>
    </section>
  );
}

function cityPrepositional(city: string) {
  // "Ташкент" -> "Ташкенте". Boshqa shaharlar uchun config'dagi nomni tekshiring.
  return /[бвгджзклмнпрстфхцчшщ]$/i.test(city) ? city + "е" : city;
}

/* -------- Signature visual: kotyol boshqaruv paneli va manometr -------- */

const C = 160;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)] as const;
};
const barToDeg = (b: number) => -135 + (b / 4) * 270;
function arc(b1: number, b2: number, r: number) {
  const [x1, y1] = pt(barToDeg(b1), r);
  const [x2, y2] = pt(barToDeg(b2), r);
  const large = barToDeg(b2) - barToDeg(b1) > 180 ? 1 : 0;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function BoilerPanel({ t }: { t: Dict }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i / 10);
  return (
    <figure className="relative mx-auto hidden w-full max-w-[440px] lg:block" aria-hidden="true">
      <div className="rounded-lg border border-ink-700 bg-ink-800/80 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-3 gap-3 border-b border-ink-700 pb-5">
          <Readout label={t.hero.supply} value="65" unit="°C" />
          <Readout label={t.hero.pressure} value="1.5" unit="bar" />
          <div>
            <div className="text-xs text-ink-400">{t.hero.status}</div>
            <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
              </span>
              {t.hero.statusOk}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 320 300" className="mt-4 w-full">
          <circle cx={C} cy={C} r="138" fill="#0E1726" stroke="#22314D" strokeWidth="2" />
          <path d={arc(1, 2, 118)} stroke="#1F9D6B" strokeWidth="10" fill="none" />
          <path d={arc(3, 4, 118)} stroke="#FF6A13" strokeWidth="10" fill="none" opacity=".85" />
          {ticks.map((b) => {
            const major = Math.abs(b * 2 - Math.round(b * 2)) < 1e-6;
            const [x1, y1] = pt(barToDeg(b), 108);
            const [x2, y2] = pt(barToDeg(b), major ? 92 : 100);
            return <line key={b} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? "#B3BDCC" : "#3A4A66"} strokeWidth={major ? 2.2 : 1.2} />;
          })}
          {[0, 1, 2, 3, 4].map((b) => {
            const [x, y] = pt(barToDeg(b), 74);
            return (
              <text key={b} x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#B3BDCC" fontFamily="inherit">
                {b}
              </text>
            );
          })}
          <text x={C} y={C + 62} textAnchor="middle" fontSize="13" fill="#8593AA" fontFamily="inherit">bar</text>
          <g className="gauge-needle">
            <path d={`M${C - 5} ${C} L${C} ${C - 112} L${C + 5} ${C} Z`} fill="#FF6A13" />
          </g>
          <circle cx={C} cy={C} r="13" fill="#16223A" stroke="#FF6A13" strokeWidth="3" />
        </svg>

        <div className="mt-2 border-t border-ink-700 pt-5">
          <PipeCompare t={t} />
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-ink-400">{t.hero.panelCaption}</figcaption>
    </figure>
  );
}

function PipeCompare({ t, className = "" }: { t: Dict; className?: string }) {
  return (
    <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${className}`}>
      <PipeCut state="dirty" title={t.hero.before} note={t.hero.scale} />
      <ArrowIcon size={22} className="text-flame-500" />
      <PipeCut state="clean" title={t.hero.after} note={t.hero.clean} />
    </div>
  );
}

function PipeCut({ state, title, note }: { state: "dirty" | "clean"; title: string; note: string }) {
  const dirty = state === "dirty";
  return (
    <figure className="text-center">
      <svg viewBox="0 0 120 120" className="mx-auto w-full max-w-[104px]">
        <circle cx="60" cy="60" r="56" fill="#16223A" stroke="#3A4A66" strokeWidth="6" />
        {dirty ? (
          <>
            <circle cx="60" cy="60" r="44" fill="#6B3A17" />
            <circle cx="60" cy="60" r="34" fill="#8A4B1E" />
            <path
              d="M60 26a34 34 0 0 1 24 58 26 26 0 0 0-40-44 34 34 0 0 1 16-14Z"
              fill="#A75C23"
            />
            <circle cx="58" cy="62" r="17" fill="#0B1420" />
          </>
        ) : (
          <>
            <circle cx="60" cy="60" r="44" fill="#1B2B45" />
            <circle cx="60" cy="60" r="40" fill="#1E7FC0" />
            <circle cx="60" cy="60" r="40" fill="url(#flow)" />
            <path d="M44 48c8 6 24 6 32 0" stroke="#A9DCFB" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
            <path d="M42 62c10 7 26 7 36 0" stroke="#A9DCFB" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />
          </>
        )}
        <defs>
          <radialGradient id="flow" cx="0.35" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#7FD0FF" stopOpacity="0.85" />
            <stop offset="1" stopColor="#1368A8" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
      <figcaption className="mt-2">
        <span className="block text-[0.82rem] font-bold text-white">{title}</span>
        <span className={`block text-[0.74rem] ${dirty ? "text-flame-400" : "text-[#7FD0FF]"}`}>{note}</span>
      </figcaption>
    </figure>
  );
}

function Readout({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-xs text-ink-400">{label}</div>
      <div className="mt-1 font-extrabold tabular-nums tracking-tight text-white">
        <span className="text-[1.7rem] leading-none">{value}</span>
        <span className="ml-1 text-sm font-semibold text-ink-300">{unit}</span>
      </div>
    </div>
  );
}
