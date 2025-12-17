# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy built application with correct ownership
COPY --from=builder --chown=backend:nodejs /app .

# Switch to non-root user
USER backend

# Expose port
EXPOSE 5000

# Set environment variables
ENV PORT 5000
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]