import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

/**
 * Til marshrutlash: /uz/... va /ru/...
 * "/" ga kirganda: cookie → brauzer tili → uz.
 * Tanlangan til cookie'da saqlanadi (1 yil).
 */
function detect(req: NextRequest): Lang {
  const c = req.cookies.get(LANG_COOKIE)?.value;
  if (isLang(c)) return c;
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  const ruIdx = al.search(/\bru\b/);
  const uzIdx = al.search(/\buz\b/);
  if (ruIdx !== -1 && (uzIdx === -1 || ruIdx < uzIdx)) return "ru";
  return DEFAULT_LANG;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (isLang(first)) {
    const res = NextResponse.next();
    if (req.cookies.get(LANG_COOKIE)?.value !== first) {
      res.cookies.set(LANG_COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const lang = detect(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|icon.svg|apple-icon.png|og.png|robots.txt|sitemap.xml|manifest.webmanifest|images|.*\\..*).*)"],
};
