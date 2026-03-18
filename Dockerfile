# ── Stage 1: Build React client ──────────────────────────────
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ───────────────────────────────
FROM node:22-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist ./public

ENV NODE_ENV=production
EXPOSE ${PORT:-3000}
CMD ["node", "index.js"]
