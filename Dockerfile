# Multi-stage production build for Leading Edge FSM Full-Stack Platform
# Stage 1: Build & Automated Test Verification
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig*.json vite.config.ts ./
RUN npm ci

COPY . .
RUN npm run build
RUN node --test server/tests/api.test.js

# Stage 2: Lightweight Production Execution
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000

COPY package*.json ./
RUN npm ci --omit=dev --omit=optional

COPY --from=builder /app/dist ./dist

EXPOSE 10000

CMD ["node", "dist/server/server/index.js"]
