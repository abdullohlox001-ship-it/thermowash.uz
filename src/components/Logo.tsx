export default function Logo({ name, tone = "dark" }: { name: string; tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt=""
        width={34}
        height={34}
        className="shrink-0"
        style={{ width: "clamp(28px, 8vw, 34px)", height: "auto" }}
      />
      <span className={`whitespace-nowrap text-[0.95rem] font-extrabold leading-none tracking-tight sm:text-[1.05rem] ${tone === "dark" ? "text-ink-900" : "text-white"}`}>
        {name}
      </span>
    </span>
  );
}
