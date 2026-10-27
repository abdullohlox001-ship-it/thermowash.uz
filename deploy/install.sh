#!/usr/bin/env bash
# ============================================================
#  THERMOWASH — serverga avtomatik o'rnatish
#  Mavjud Docker + Nginx (maktab-nginx-1) muhitiga qo'shiladi.
#
#  Ishlatish (loyiha papkasi ichida, root sifatida):
#      sudo bash deploy/install.sh
#
#  Nima qiladi:
#   1. Kerakli ma'lumotlarni so'raydi (domen, email, Telegram token/chat ID)
#   2. Loyihani /opt/thermowash ga ko'chiradi va .env yaratadi
#   3. Docker image yig'ib, konteynerni ishga tushiradi (mavjud nginx tarmog'ida)
#   4. Nginx konfiguratsiyasini qo'shadi (avval HTTP)
#   5. Let's Encrypt sertifikatini oladi (mavjud certbot volume'lari bilan)
#   6. HTTPS ni yoqadi va saytni tekshiradi
#
#  Mavjud maktab loyihasiga tegmaydi. Har bir qadamda xato bo'lsa to'xtaydi.
# ============================================================
set -Eeuo pipefail

# ---------- sozlanadigan qiymatlar (kerak bo'lsa o'zgartiring) ----------
APP_DIR="${APP_DIR:-/opt/thermowash}"      # o'rnatish papkasi (skript so'raydi)
NGINX_CONTAINER="${NGINX_CONTAINER:-maktab-nginx-1}"
NGINX_CONF_DIR="${NGINX_CONF_DIR:-/opt/maktab/nginx/conf.d}"
DOCKER_NETWORK="${DOCKER_NETWORK:-maktab_default}"
CERT_CONF_VOLUME="${CERT_CONF_VOLUME:-maktab_certbot_conf}"
CERT_WWW_VOLUME="${CERT_WWW_VOLUME:-maktab_certbot_www}"
CONTAINER_NAME="thermowash"
IMAGE_NAME="thermowash:latest"
COMPOSE_FILE="docker-compose.coexist.yml"
APP_PORT=3000

RED=$'\e[31m'; GRN=$'\e[32m'; YEL=$'\e[33m'; BLD=$'\e[1m'; RST=$'\e[0m'
say()  { echo "${BLD}==>${RST} $*"; }
ok()   { echo "${GRN}  ✓${RST} $*"; }
warn() { echo "${YEL}  !${RST} $*"; }
die()  { echo "${RED}XATO:${RST} $*" >&2; exit 1; }
trap 'die "skript $LINENO-qatorda to‘xtadi"' ERR

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ---------- 0. Tekshiruvlar ----------
say "Muhitni tekshiryapman"
[[ $EUID -eq 0 ]] || die "root kerak: sudo bash deploy/install.sh"
command -v docker >/dev/null || die "docker topilmadi"
docker compose version >/dev/null 2>&1 || die "'docker compose' plagini topilmadi"
[[ -f "$SRC_DIR/package.json" && -f "$SRC_DIR/Dockerfile" && -f "$SRC_DIR/$COMPOSE_FILE" ]] || die "loyiha fayllari topilmadi ($SRC_DIR)"
docker ps --format '{{.Names}}' | grep -qx "$NGINX_CONTAINER" || die "nginx konteyneri '$NGINX_CONTAINER' ishlamayapti"
docker network inspect "$DOCKER_NETWORK" >/dev/null 2>&1 || die "docker tarmog'i '$DOCKER_NETWORK' topilmadi"
[[ -d "$NGINX_CONF_DIR" ]] || die "nginx conf papkasi topilmadi: $NGINX_CONF_DIR"
docker volume inspect "$CERT_CONF_VOLUME" >/dev/null 2>&1 || die "volume topilmadi: $CERT_CONF_VOLUME"
docker volume inspect "$CERT_WWW_VOLUME"  >/dev/null 2>&1 || die "volume topilmadi: $CERT_WWW_VOLUME"
ok "docker, nginx ($NGINX_CONTAINER), tarmoq ($DOCKER_NETWORK), certbot volume'lari joyida"

# ---------- 1. Ma'lumotlarni so'rash ----------
ask() { # ask "savol" "standart" VAR_NOMI
  local q="$1" def="${2:-}" var="$3" ans
  if [[ -n "${!var:-}" ]]; then echo "  $q: ${!var} (env'dan)"; return; fi
  if [[ -n "$def" ]]; then read -rp "  $q [$def]: " ans; ans="${ans:-$def}"
  else read -rp "  $q: " ans; fi
  printf -v "$var" '%s' "$ans"
}

echo
say "Ma'lumotlarni kiriting (Enter = standart qiymat)"
ask "O'rnatish papkasi" "$APP_DIR" APP_DIR
ask "Domen" "thermowash.uz" DOMAIN
ask "www ham ishlatilsinmi? (y/n)" "y" USE_WWW
ask "Let's Encrypt uchun email (sertifikat ogohlantirishlari)" "" LE_EMAIL
[[ -n "$LE_EMAIL" ]] || die "email majburiy"
ask "Telegram bot token (@BotFather)" "" TELEGRAM_BOT_TOKEN
ask "Telegram chat ID (bir nechta: 123,-100456)" "" TELEGRAM_CHAT_ID
[[ -n "$TELEGRAM_BOT_TOKEN" && -n "$TELEGRAM_CHAT_ID" ]] || warn "Telegram bo'sh — arizalar faqat data/leads.jsonl faylga yoziladi"

SITE_URL="https://${DOMAIN}"
DOMAIN_ARGS=(-d "$DOMAIN")
SERVER_NAMES="$DOMAIN"
if [[ "$USE_WWW" =~ ^[Yy] ]]; then DOMAIN_ARGS+=(-d "www.${DOMAIN}"); SERVER_NAMES="$DOMAIN www.${DOMAIN}"; fi

# ---------- 2. DNS tekshiruvi ----------
say "DNS tekshiruvi"
SERVER_IP="$(curl -fsS --max-time 10 https://ifconfig.me || true)"
for d in $SERVER_NAMES; do
  RESOLVED="$(getent ahostsv4 "$d" 2>/dev/null | awk 'NR==1{print $1}' || true)"
  if [[ -z "$RESOLVED" ]]; then die "$d hech qayerga yo'naltirilmagan. DNS'da A yozuvini qo'shing: $d -> $SERVER_IP"
  elif [[ -n "$SERVER_IP" && "$RESOLVED" != "$SERVER_IP" ]]; then
    warn "$d -> $RESOLVED (server IP: $SERVER_IP). Cloudflare proxy bo'lsa normal, aks holda sertifikat olinmaydi."
    read -rp "  Davom etaymi? (y/n) [n]: " c; [[ "$c" =~ ^[Yy] ]] || exit 1
  else ok "$d -> $RESOLVED"; fi
done

# ---------- 3. Nginx'da domen band emasligini tekshirish ----------
if grep -rlsE "server_name[^;]*\b${DOMAIN//./\\.}\b" "$NGINX_CONF_DIR" | grep -v "thermowash.conf" | grep -q .; then
  warn "Bu domen uchun allaqachon konfiguratsiya bor:"
  grep -rlsE "server_name[^;]*\b${DOMAIN//./\\.}\b" "$NGINX_CONF_DIR" | grep -v "thermowash.conf" | sed 's/^/     /'
  read -rp "  Baribir davom etaymi? (y/n) [n]: " c; [[ "$c" =~ ^[Yy] ]] || exit 1
fi

# ---------- 3.5 Eski THERMIX o'rnatmasini tozalash (bo'lsa) ----------
if docker ps -a --format '{{.Names}}' | grep -qx "thermix"; then
  warn "eski 'thermix' konteyneri topildi — to'xtatilib o'chiriladi"
  docker rm -f thermix >/dev/null 2>&1 || true
fi
if [[ -f "$NGINX_CONF_DIR/thermix.conf" ]]; then
  warn "eski nginx konfiguratsiyasi (thermix.conf) olib tashlanadi"
  mv "$NGINX_CONF_DIR/thermix.conf" "/root/thermix.conf.bak.$(date +%s)"
fi

# ---------- 4. Fayllarni ko'chirish va .env ----------
say "Loyihani $APP_DIR ga ko'chiryapman"
mkdir -p "$APP_DIR"
if [[ "$(readlink -f "$SRC_DIR")" != "$(readlink -f "$APP_DIR")" ]]; then
  tar -C "$SRC_DIR" --exclude=node_modules --exclude=.next --exclude=.git -cf - . | tar -C "$APP_DIR" -xf -
fi
mkdir -p "$APP_DIR/data"
ok "fayllar joyida"

ENV_FILE="$APP_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then cp "$ENV_FILE" "$ENV_FILE.bak.$(date +%s)"; fi
umask 077
cat > "$ENV_FILE" <<ENVEOF
NEXT_PUBLIC_SITE_URL=${SITE_URL}
PORT=3000
HOSTNAME=0.0.0.0
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
TELEGRAM_API_URL=
LEADS_LOG_FILE=/app/data/leads.jsonl
DOCKER_NETWORK=${DOCKER_NETWORK}
IP_HASH_SALT=$(head -c 24 /dev/urandom | base64 | tr -d '/+=')
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_YANDEX_VERIFICATION=
ENVEOF
umask 022
chmod 600 "$ENV_FILE"
ok ".env yaratildi (maxfiy, faqat root o'qiydi)"

# ---------- 5. Image yig'ish va konteynerni ishga tushirish ----------
say "Docker image yig'ilyapti va konteyner ko'tarilyapti (1–3 daqiqa)"
cd "$APP_DIR"
docker compose -f "$COMPOSE_FILE" up -d --build
ok "konteyner ishga tushdi"

say "Konteyner javob berishini kutyapman"
for i in $(seq 1 40); do
  if docker exec "$CONTAINER_NAME" wget -q -O /dev/null "http://127.0.0.1:${APP_PORT}/uz" 2>/dev/null; then
    ok "sayt konteyner ichida javob beryapti"; break
  fi
  [[ $i -eq 40 ]] && { docker compose -f "$COMPOSE_FILE" logs --tail 40; die "konteyner javob bermadi"; }
  sleep 2
done

# ---------- 6. Nginx: avval HTTP (sertifikat olish uchun) ----------
CONF_FILE="$NGINX_CONF_DIR/thermowash.conf"
say "Nginx konfiguratsiyasi qo'shilyapti: $CONF_FILE"
[[ -f "$CONF_FILE" ]] && cp "$CONF_FILE" "$CONF_FILE.bak.$(date +%s)"

cat > "$CONF_FILE" <<NGXEOF
# THERMOWASH — avtomatik yaratilgan (deploy/install.sh)
limit_req_zone \$binary_remote_addr zone=thermowash_lead:10m rate=6r/m;

server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAMES};

    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 "thermowash: sertifikat kutilmoqda\n"; add_header Content-Type text/plain; }
}
NGXEOF

docker exec "$NGINX_CONTAINER" nginx -t >/dev/null 2>&1 || { docker exec "$NGINX_CONTAINER" nginx -t; rm -f "$CONF_FILE"; die "nginx konfiguratsiyasi xato — fayl o'chirildi, eski sayt ishlayapti"; }
docker exec "$NGINX_CONTAINER" nginx -s reload
ok "HTTP konfiguratsiyasi faol"

# ---------- 7. Let's Encrypt sertifikati ----------
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
if docker run --rm -v "${CERT_CONF_VOLUME}:/etc/letsencrypt" alpine:3 test -f "$CERT_PATH"; then
  ok "sertifikat allaqachon bor — qayta olinmaydi"
else
  say "Let's Encrypt sertifikati olinyapti"
  docker run --rm \
    -v "${CERT_CONF_VOLUME}:/etc/letsencrypt" \
    -v "${CERT_WWW_VOLUME}:/var/www/certbot" \
    certbot/certbot certonly --webroot -w /var/www/certbot \
    "${DOMAIN_ARGS[@]}" --email "$LE_EMAIL" --agree-tos --no-eff-email --non-interactive \
    || { rm -f "$CONF_FILE"; docker exec "$NGINX_CONTAINER" nginx -s reload; die "sertifikat olinmadi (DNS yoki 80-port muammosi). Konfiguratsiya qaytarildi."; }
  ok "sertifikat olindi"
fi

# ---------- 8. Nginx: HTTPS ----------
say "HTTPS yoqilyapti"
REDIRECT_WWW=""
if [[ "$USE_WWW" =~ ^[Yy] ]]; then
REDIRECT_WWW="server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.${DOMAIN};
    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    return 301 https://${DOMAIN}\$request_uri;
}"
fi

cat > "$CONF_FILE" <<NGXEOF
# THERMOWASH — avtomatik yaratilgan (deploy/install.sh)
limit_req_zone \$binary_remote_addr zone=thermowash_lead:10m rate=6r/m;

server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAMES};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://${DOMAIN}\$request_uri; }
}

${REDIRECT_WWW}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL_thermowash:10m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    client_max_body_size 64k;

    # Docker DNS orqali nomni ish paytida aniqlaymiz: thermowash konteyneri
    # o'chib qolsa ham nginx qayta yuklanaveradi (boshqa saytlarga ta'sir qilmaydi).
    resolver 127.0.0.11 ipv6=off valid=30s;
    set \$thermowash_upstream http://${CONTAINER_NAME}:${APP_PORT};

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;
    gzip_min_length 1024;

    location = /api/lead {
        limit_req zone=thermowash_lead burst=5 nodelay;
        limit_req_status 429;
        proxy_pass \$thermowash_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header Connection "";
        proxy_read_timeout 30s;
    }

    location /_next/static/ {
        proxy_pass \$thermowash_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header Connection "";
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass \$thermowash_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header Connection "";
        proxy_read_timeout 30s;
    }
}
NGXEOF

docker exec "$NGINX_CONTAINER" nginx -t >/dev/null 2>&1 || { docker exec "$NGINX_CONTAINER" nginx -t; die "nginx xato — $CONF_FILE ni tekshiring"; }
docker exec "$NGINX_CONTAINER" nginx -s reload
ok "HTTPS faol"

# ---------- 9. Sertifikat yangilangandan keyin nginx reload ----------
CRON_LINE="0 4 * * * docker exec ${NGINX_CONTAINER} nginx -s reload >/dev/null 2>&1"
if ! crontab -l 2>/dev/null | grep -Fq "docker exec ${NGINX_CONTAINER} nginx -s reload"; then
  (crontab -l 2>/dev/null || true; echo "$CRON_LINE") | crontab -
  ok "har kuni 04:00 da nginx reload (sertifikat yangilanishi uchun) qo'shildi"
fi

# ---------- 10. Yakuniy tekshiruv ----------
say "Saytni tashqaridan tekshiryapman"
sleep 2
CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "https://${DOMAIN}/uz" || echo 000)"
[[ "$CODE" == "200" ]] && ok "https://${DOMAIN}/uz -> 200 OK" || warn "javob kodi: $CODE (DNS yoki firewall'ni tekshiring)"

echo
echo "${GRN}${BLD}TAYYOR${RST}"
echo "  Sayt:        https://${DOMAIN}"
echo "  Loyiha:      ${APP_DIR}"
echo "  Sozlamalar:  ${APP_DIR}/.env"
echo "  Arizalar:    ${APP_DIR}/data/leads.jsonl"
echo
echo "  Holat:       cd ${APP_DIR} && docker compose -f ${COMPOSE_FILE} ps"
echo "  Loglar:      cd ${APP_DIR} && docker compose -f ${COMPOSE_FILE} logs -f"
echo "  Qayta ishga: cd ${APP_DIR} && docker compose -f ${COMPOSE_FILE} restart"
echo "  Yangilash:   cd ${APP_DIR} && bash deploy/update.sh"
echo "  O'chirish:   cd ${APP_DIR} && bash deploy/uninstall.sh"
echo
echo "  Endi saytdan sinov ariza yuboring — Telegram'ga xabar kelishi kerak."
