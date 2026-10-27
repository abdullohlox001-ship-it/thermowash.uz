# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GTM_ID=
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
ARG NEXT_PUBLIC_YANDEX_VERIFICATION=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=$NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION \
    NEXT_PUBLIC_YANDEX_VERIFICATION=$NEXT_PUBLIC_YANDEX_VERIFICATION
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- run ----
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 LEADS_LOG_FILE=/app/data/leads.jsonl
RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/data && chown app:app /app/data
COPY --from=build --chown=app:app /app/.next/standalone ./
USER app
EXPOSE 3000
CMD ["node", "server.js"]
