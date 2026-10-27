#!/usr/bin/env bash
# THERMOWASH ni serverdan olib tashlash. Arizalar fayli (data/) saqlanib qoladi.
set -Eeuo pipefail
APP_DIR="${APP_DIR:-/opt/thermowash}"
NGINX_CONTAINER="${NGINX_CONTAINER:-maktab-nginx-1}"
NGINX_CONF_DIR="${NGINX_CONF_DIR:-/opt/maktab/nginx/conf.d}"

[[ $EUID -eq 0 ]] || { echo "root kerak"; exit 1; }
read -rp "THERMOWASH o'chirilsinmi? Nginx konfiguratsiyasi va konteyner olib tashlanadi (y/n) [n]: " c
[[ "$c" =~ ^[Yy] ]] || exit 0

rm -f "$NGINX_CONF_DIR/thermowash.conf"
docker exec "$NGINX_CONTAINER" nginx -t && docker exec "$NGINX_CONTAINER" nginx -s reload
if [[ -f "$APP_DIR/docker-compose.coexist.yml" ]]; then
  (cd "$APP_DIR" && docker compose -f docker-compose.coexist.yml down) || true
else
  docker rm -f thermowash >/dev/null 2>&1 || true
fi
docker rmi thermowash:latest thermowash:previous >/dev/null 2>&1 || true
echo "O'chirildi. Fayllar va arizalar shu yerda qoldi: $APP_DIR"
echo "Butunlay o'chirish uchun: rm -rf $APP_DIR"
