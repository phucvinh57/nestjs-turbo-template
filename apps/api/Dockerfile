#* Stage 0: Prepare base image, pnpm and essential packages
FROM node:22-bullseye-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.14.1 --activate

#* Stage 1: Prune
FROM base AS pruner
RUN npm install -g turbo@2.5.3
COPY --chown=node:node . .
RUN turbo prune fmv-api --docker --out-dir out/api

#* Stage 2: Build
FROM base AS builder
COPY --from=pruner /app/out/api/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline --ignore-scripts
COPY --from=pruner /app/out/api/full .
RUN pnpm dlx turbo build --filter=fmv-api

#* Stage 3: Runner
FROM base AS runner
COPY --chown=node:node --from=builder ./app/modules ./modules
COPY --chown=node:node --from=builder ./app/packages ./packages
COPY --chown=node:node --from=builder ./app/node_modules ./node_modules
COPY --chown=node:node --from=builder ./app/apps/api/dist/ ./apps/api/dist/
COPY --chown=node:node --from=builder ./app/apps/api/node_modules/ ./apps/api/node_modules/
WORKDIR /app/apps/api
EXPOSE 3333
CMD ["node", "dist/main.js"]