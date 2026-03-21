# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

# Workspace manifest files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.json ./

# Source packages
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY artifacts/ryuu-vpn/ ./artifacts/ryuu-vpn/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build frontend — BASE_PATH=/ so it runs at the domain root
RUN BASE_PATH=/ pnpm --filter @workspace/ryuu-vpn run build

# Build API server (esbuild bundles all deps into dist/)
RUN pnpm --filter @workspace/api-server run build

# ─── Stage 2: Production image ────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

# Only copy the built artifacts — no node_modules needed (esbuild bundled everything)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/ryuu-vpn/dist/public ./artifacts/ryuu-vpn/dist/public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
