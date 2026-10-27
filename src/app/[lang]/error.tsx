"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { ErrorView } from "./not-found";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const lang = usePathname()?.startsWith("/ru") ? "ru" : "uz";
  const t = getDict(lang);
  return (
    <ErrorView
      code="500"
      title={t.errors.errorTitle}
      text={t.errors.errorText}
      home={t.errors.home}
      lang={lang}
      call={t.cta.callShort}
      action={<button type="button" onClick={reset} className="btn-outline h-14 px-7">{t.errors.retry}</button>}
    />
  );
}
