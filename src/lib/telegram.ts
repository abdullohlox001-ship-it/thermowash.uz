import "server-only";

/**
 * Telegram xabarnoma. Token faqat serverda (.env) — frontendga hech qachon chiqmaydi.
 * TELEGRAM_CHAT_ID bir nechta bo'lishi mumkin: "123,-100456" (vergul bilan).
 */
export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || chats.length === 0) return false;

  const results = await Promise.all(
    chats.map(async (chat_id) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const base = (process.env.TELEGRAM_API_URL || "https://api.telegram.org").replace(/\/$/, "");
          const res = await fetch(`${base}/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
            signal: AbortSignal.timeout(8000),
            cache: "no-store",
          });
          if (res.ok) return true;
          console.error("[telegram] HTTP", res.status, (await res.text()).slice(0, 300));
          if (res.status < 500 && res.status !== 429) return false;
        } catch (err) {
          console.error("[telegram] network error", (err as Error).message);
        }
        await new Promise((r) => setTimeout(r, 800));
      }
      return false;
    }),
  );
  return results.some(Boolean);
}
