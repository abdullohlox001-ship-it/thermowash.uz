"use client";

import { phoneDisplay, phoneHref } from "@/config/business";

/** Eng oxirgi himoya: layout ham ishlamay qolsa. Minimal inline uslub. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="uz">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0E1726", color: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <main style={{ maxWidth: 520 }}>
          <p style={{ color: "#FF6A13", fontSize: 56, fontWeight: 800, margin: 0 }}>500</p>
          <h1 style={{ fontSize: 26, margin: "12px 0" }}>Sahifani yuklab bo‘lmadi / Не удалось загрузить страницу</h1>
          <p style={{ color: "#B3BDCC", lineHeight: 1.6 }}>Iltimos, qayta urinib ko‘ring yoki qo‘ng‘iroq qiling. / Обновите страницу или позвоните нам.</p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button onClick={reset} style={{ height: 52, padding: "0 22px", borderRadius: 6, border: "1px solid #fff", background: "transparent", color: "#fff", fontWeight: 700, fontSize: 16 }}>Qayta / Обновить</button>
            <a href={phoneHref} style={{ height: 52, padding: "0 22px", borderRadius: 6, background: "#FF6A13", color: "#08101C", fontWeight: 700, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{phoneDisplay}</a>
          </p>
        </main>
      </body>
    </html>
  );
}
