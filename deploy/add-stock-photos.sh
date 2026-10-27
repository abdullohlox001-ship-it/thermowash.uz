#!/usr/bin/env bash
# ============================================================
#  Vaqtinchalik rasmlar (Pexels — bepul, tijorat uchun ruxsat etilgan)
#
#  Ishlatish:
#      cd /opt/thermowash && bash deploy/add-stock-photos.sh
#      bash deploy/update.sh
#
#  Bu rasmlar — chet el ustalarining "stock" suratlari. Ular sayt bo'sh
#  ko'rinmasligi uchun vaqtincha qo'yiladi. O'z ish suratlaringiz paydo
#  bo'lishi bilan ularni almashtiring: public/images/ ichidagi fayllarni
#  o'zingiznikiga almashtiring yoki src/content/media.ts ni tahrirlang.
#
#  Litsenziya: https://www.pexels.com/license/ — bepul, tijoratda ishlatish
#  mumkin, muallifni ko'rsatish shart emas.
#
#  Rasmlarni boshqasiga almashtirmoqchi bo'lsangiz, pexels.com dan tanlang,
#  havoladagi raqamni (masalan .../photo/...-7859953/ dagi 7859953) quyidagi
#  ro'yxatga yozing.
# ============================================================
set -Eeuo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
IMG_DIR="$APP_DIR/public/images"
W=1600   # yuklab olinadigan kenglik

# fayl_nomi|pexels_id|sahifa
PHOTOS=(
  "hero|7859953|https://www.pexels.com/photo/plumber-repairing-power-source-7859953/"
  "works/1|34938442|https://www.pexels.com/photo/technician-maintaining-heating-system-in-workshop-34938442/"
  "works/2|7937300|https://www.pexels.com/photo/steel-pipes-with-pressure-gauge-7937300/"
  "works/3|34938439|https://www.pexels.com/photo/technician-repairing-heating-system-in-workshop-34938439/"
  "works/4|34938446|https://www.pexels.com/photo/technician-adjusting-industrial-pipeline-valves-34938446/"
  "works/5|34938441|https://www.pexels.com/photo/engineer-adjusting-industrial-pipes-in-factory-34938441/"
)

command -v curl >/dev/null || { echo "curl kerak: apt install -y curl"; exit 1; }
mkdir -p "$IMG_DIR/works"

echo "==> Rasmlar yuklab olinyapti (Pexels)"
for row in "${PHOTOS[@]}"; do
  IFS='|' read -r name id _page <<< "$row"
  out="$IMG_DIR/${name}.jpg"
  url="https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${W}"
  if curl -fsSL --max-time 60 -o "$out.tmp" "$url"; then
    mv "$out.tmp" "$out"
    printf '  ✓ %-10s %s KB\n' "$name" "$(( $(stat -c%s "$out") / 1024 ))"
  else
    rm -f "$out.tmp"
    echo "  ! $name yuklanmadi (internetni tekshiring)"
  fi
done

MEDIA="$APP_DIR/src/content/media.ts"
[[ -f "$MEDIA" ]] && cp "$MEDIA" "$MEDIA.bak"

echo "==> src/content/media.ts yangilanyapti"
python3 - "$MEDIA" <<'PY'
import re, sys, os
path = sys.argv[1]
src = open(path, encoding="utf-8").read()

hero = '''export const heroPhoto: Photo | null = {
  src: "/images/hero.jpg",
  alt: { uz: "Usta kotyol va isitish tizimini sozlamoqda", ru: "Мастер настраивает котёл и систему отопления" },
};'''

works = '''export const works: Photo[] = [
  {
    src: "/images/works/1.jpg",
    alt: { uz: "Usta isitish tizimiga texnik xizmat ko‘rsatmoqda", ru: "Мастер обслуживает систему отопления" },
    caption: { uz: "Texnik xizmat", ru: "Техобслуживание" },
  },
  {
    src: "/images/works/2.jpg",
    alt: { uz: "Isitish tizimi quvurlari va manometr", ru: "Трубы отопления и манометр" },
    caption: { uz: "Bosimni tekshirish", ru: "Проверка давления" },
  },
  {
    src: "/images/works/3.jpg",
    alt: { uz: "Isitish uskunasini ta’mirlash", ru: "Ремонт отопительного оборудования" },
    caption: { uz: "Ta’mirlash", ru: "Ремонт" },
  },
  {
    src: "/images/works/4.jpg",
    alt: { uz: "Isitish tizimi klapanlarini sozlash", ru: "Настройка клапанов системы отопления" },
    caption: { uz: "Sozlash", ru: "Наладка" },
  },
  {
    src: "/images/works/5.jpg",
    alt: { uz: "Isitish quvurlari montaji", ru: "Монтаж труб отопления" },
    caption: { uz: "Montaj", ru: "Монтаж" },
  },
];'''

src = re.sub(r"^export const heroPhoto: Photo \| null = [\s\S]*?;\n", lambda m: hero + "\n", src, count=1, flags=re.M)
src = re.sub(r"^export const works: Photo\[\] = [\s\S]*?\];\n", lambda m: works + "\n", src, count=1, flags=re.M)
open(path, "w", encoding="utf-8").write(src)
print("  ✓ media.ts yozildi (zaxira: media.ts.bak)")
PY

echo
echo "TAYYOR. Endi saytni yangilang:"
echo "  cd $APP_DIR && bash deploy/update.sh"
