#####################################################
# Build stage
#####################################################
FROM node:24.13-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (including devDependencies for building)
RUN yarn install --frozen-lockfile

# Copy source code and config files
COPY tsconfig.json ./
COPY src ./src


# Build TypeScript
RUN yarn build

#####################################################
# Production stage
#####################################################
FROM node:24.13-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Copy built application from builder stage
COPY --from=builder --chown=node:node /app/build ./build

# Switch to non-root user for security
USER node

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "build/index.js"]
