# =============================================================================
# Stage 1: Dependencies - Cache node_modules separately
# =============================================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Use npm ci for clean, reproducible installs
RUN npm ci --only=production && \
    npm cache clean --force

# =============================================================================
# Stage 2: Build - Install dev deps and build the app
# =============================================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./

# Install dev dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Set production environment variables for Kubb generation
ARG API_FIBERLASER
ARG API_FIBERLASER_SWAGGER
ENV API_FIBERLASER=http://192.168.99.129:9192
ENV API_FIBERLASER_SWAGGER=http://192.168.99.129:9192/api/doc-json
ENV TLS_REJECT_UNAUTHORIZED=0

# Generate Kubb clients with production configuration
RUN npm run generate

# Build the Angular app in production mode (production is default config)
RUN npm run build

# =============================================================================
# Stage 3: Production - Minimal nginx image
# =============================================================================
FROM nginx:alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]