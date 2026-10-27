import type { SVGProps } from "react";
import type { IconName } from "@/content/services";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const PhoneIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </Svg>
);
export const FormIcon = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 3.5h6v2.5H9zM8.5 11h7M8.5 15h4.5" />
  </Svg>
);
export const FlameIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 1.5-4.5 2.5-6 .5 2 1.5 3 2.5 3-1-3 0-6 1-8Z" />
  </Svg>
);
export const GaugeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="M12 17l4-5" />
    <circle cx="12" cy="17" r="1.2" />
  </Svg>
);
export const InstallIcon = (p: P) => (
  <Svg {...p}>
    <rect x="6" y="3" width="12" height="13" rx="1.5" />
    <path d="M9 7h6M9 16v5M15 16v5M12 16v5" />
    <circle cx="12" cy="11" r="1.6" />
  </Svg>
);
export const WrenchIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14.5 4.5a4 4 0 0 0 4.9 5L20 10l-9.5 9.5a2 2 0 0 1-3-3L17 7l.5.6a4 4 0 0 1-3-3.1Z" />
  </Svg>
);
export const RadiatorIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 8h2M19 8h2M3 16h2M19 16h2" />
    <rect x="5" y="5" width="3" height="14" rx="1" />
    <rect x="10.5" y="5" width="3" height="14" rx="1" />
    <rect x="16" y="5" width="3" height="14" rx="1" />
  </Svg>
);
export const AlertIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5 21 19.5H3Z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
);
export const GasIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21a5 5 0 0 0 5-5c0-4-5-6-5-12-2 3-5 6-5 10 0 1 .3 2 .8 2.8" />
    <path d="M12 21a2.5 2.5 0 0 1-2.5-2.5c0-1.8 2.5-3 2.5-5 1 1.3 2.5 2.8 2.5 5A2.5 2.5 0 0 1 12 21Z" />
  </Svg>
);
export const DropIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 3.5c0 0 6.5 7 6.5 10.5a6.5 6.5 0 0 1-13 0C5.5 10.5 12 3.5 12 3.5Z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </Svg>
);
export const TankIcon = (p: P) => (
  <Svg {...p}>
    <rect x="6.5" y="3.5" width="11" height="17" rx="4" />
    <path d="M9.5 8h5M9.5 12h5" />
    <path d="M12 20.5v1" />
  </Svg>
);
export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const ChevronIcon = (p: P) => (
  <Svg {...p}>
    <path d="m7 10 5 5 5-5" />
  </Svg>
);
export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const TelegramIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21 4 3 11l6 2.2M21 4l-3 16-9-6.8M21 4 9 13.2V19l3.2-3.3" />
  </Svg>
);
export const ClockIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const PinIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const ArrowIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const WarnDotIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5M12 16.2h.01" />
  </Svg>
);

export function ServiceIcon({ name, ...p }: P & { name: IconName }) {
  const map = {
    flame: FlameIcon,
    gauge: GaugeIcon,
    install: InstallIcon,
    wrench: WrenchIcon,
    radiator: RadiatorIcon,
    alert: AlertIcon,
    gas: GasIcon,
    drop: DropIcon,
    tank: TankIcon,
  } as const;
  const C = map[name];
  return <C {...p} />;
}
