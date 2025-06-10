FROM node:20-alpine as builder

WORKDIR /app

# Copy root level package files (including workspaces)
COPY package.json yarn.lock .yarnrc.yml .env* ./
COPY .yarn ./.yarn/

# Copy frontend specific package.json and public directory
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/frontend/public ./apps/frontend/public/

# Copy types package and build it
COPY packages/types/package.json ./packages/types/
COPY packages/types/tsconfig.json ./packages/types/
COPY packages/types/src ./packages/types/src/
RUN yarn install 
RUN yarn workspace @repo/types build # Build the types package

# Copy the rest of the frontend source code
COPY . ./

# Build frontend
RUN yarn workspace frontend build

FROM node:20-alpine as runner

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/apps/frontend/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/packages/types/dist ./packages/types/dist/
COPY --from=builder /app/apps/frontend/public ./public/

ENV PORT=5173
CMD ["npx", "serve", "-s", "dist", "-p", "5173"] 