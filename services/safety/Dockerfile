# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace files for dependency resolution
COPY pnpm-workspace.yaml .pnpmfile.cjs package.json ./
COPY packages ./packages

# Copy service-specific files
COPY services/safety/package.json ./services/safety/
COPY services/safety/tsconfig*.json ./services/safety/
COPY services/safety/nest-cli*.json ./services/safety/
COPY services/safety/src ./services/safety/src

WORKDIR /app/services/safety

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@9

WORKDIR /app

# Copy package files for production deps
COPY services/safety/package.json ./services/safety/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod -r ./services/safety

# Copy built application
COPY --from=builder /app/services/safety/dist ./services/safety/dist

WORKDIR /app/services/safety

# Expose NestJS default port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

CMD ["node", "dist/main"]