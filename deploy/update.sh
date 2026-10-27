#!/usr/bin/env bash
# THERMOWASH ni yangilash: yangi kodni qo'yganingizdan keyin ishga tushiring.
#   cd /opt/thermowash && bash deploy/update.sh
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/thermowash}"
DOCKER_NETWORK="${DOCKER_NETWORK:-maktab_default}"
CONTAINER_NAME="thermowash"
IMAGE_NAME="thermowash:latest"
COMPOSE_FILE="docker-compose.coexist.yml"
GRN=$'\e[32m'; RST=$'\e[0m'

[[ $EUID -eq 0 ]] || { echo "root kerak: sudo bash deploy/update.sh"; exit 1; }
[[ -f "$APP_DIR/.env" ]] || { echo "XATO: $APP_DIR/.env topilmadi. Avval deploy/install.sh ni ishga tushiring."; exit 1; }

SITE_URL="$(grep -E '^NEXT_PUBLIC_SITE_URL=' "$APP_DIR/.env" | cut -d= -f2-)"

echo "==> Eski image zaxiraga olinyapti (rollback uchun)"
docker tag "$IMAGE_NAME" "thermowash:previous" 2>/dev/null || true

echo "==> Yangi versiya yig'ilyapti va ko'tarilyapti ($SITE_URL)"
cd "$APP_DIR"
docker compose -f "$COMPOSE_FILE" up -d --build

for i in $(seq 1 40); do
  if docker exec "$CONTAINER_NAME" wget -q -O /dev/null "http://127.0.0.1:3000/uz" 2>/dev/null; then
    echo "${GRN}TAYYOR${RST} — ${SITE_URL}"
    docker compose -f "$COMPOSE_FILE" ps
    exit 0
  fi
  [[ $i -eq 40 ]] && {
    docker compose -f "$COMPOSE_FILE" logs --tail 40
    echo "XATO: yangi versiya ko'tarilmadi."
    echo "Orqaga qaytarish: docker tag thermowash:previous $IMAGE_NAME && docker compose -f $COMPOSE_FILE up -d --no-build"
    exit 1
  }
  sleep 2
done
