# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace files for dependency resolution
COPY pnpm-workspace.yaml .pnpmfile.cjs package.json ./
COPY packages ./packages

# Copy service-specific files
COPY services/vault/package.json ./services/vault/
COPY services/vault/tsconfig*.json ./services/vault/
COPY services/vault/nest-cli*.json ./services/vault/
COPY services/vault/src ./services/vault/src

WORKDIR /app/services/vault

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@9

WORKDIR /app

# Copy package files for production deps
COPY services/vault/package.json ./services/vault/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod -r ./services/vault

# Copy built application
COPY --from=builder /app/services/vault/dist ./services/vault/dist

WORKDIR /app/services/vault

# Expose NestJS default port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

CMD ["node", "dist/main"]