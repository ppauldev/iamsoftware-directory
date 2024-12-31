# Stage 1: Dependencies
FROM node:20-slim AS deps

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-slim AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN SKIP_BUILD_STATIC_GENERATION=1 npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install OpenSSL and netcat
RUN apt-get update -y && \
    apt-get install -y \
      openssl \
      libssl3 \
      postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma/tsconfig.json ./prisma/tsconfig.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Set permissions before switching user
RUN chmod +x ./scripts/init-db.sh && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 