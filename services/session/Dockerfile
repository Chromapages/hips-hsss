# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace files for dependency resolution
COPY pnpm-workspace.yaml .pnpmfile.cjs package.json ./
COPY packages ./packages

# Copy service-specific files
COPY services/session/package.json ./services/session/
COPY services/session/tsconfig*.json ./services/session/
COPY services/session/nest-cli*.json ./services/session/
COPY services/session/src ./services/session/src

WORKDIR /app/services/session

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@9

WORKDIR /app

# Copy package files for production deps
COPY services/session/package.json ./services/session/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod -r ./services/session

# Copy built application
COPY --from=builder /app/services/session/dist ./services/session/dist

WORKDIR /app/services/session

# Expose NestJS default port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

CMD ["node", "dist/main"]