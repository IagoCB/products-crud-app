FROM node:20-alpine as builder

WORKDIR /app
RUN npm install -g yarn@4.9.2

COPY package.json yarn.lock .yarnrc.yml .env* ./
COPY .yarn ./.yarn/

COPY apps/frontend/package.json ./apps/frontend/
COPY apps/frontend/public ./apps/frontend/public/

COPY packages/types/package.json ./packages/types/
COPY packages/types/tsconfig.json ./packages/types/
COPY packages/types/src ./packages/types/src/
RUN yarn install 
RUN yarn workspace @repo/types build # Build the types package

COPY . ./

RUN yarn workspace frontend build

FROM node:20-alpine as runner

WORKDIR /app

COPY --from=builder /app/apps/frontend/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/packages/types/dist ./packages/types/dist/
COPY --from=builder /app/apps/frontend/public ./public/

ENV PORT=5173
CMD ["npx", "serve", "-s", "dist", "-p", "5173"] 