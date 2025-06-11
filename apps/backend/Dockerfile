FROM node:20-alpine as builder

WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/

RUN yarn install --immutable
RUN yarn add -D prisma

COPY . .

RUN yarn workspace backend prisma generate
RUN yarn workspace backend build

FROM node:20-alpine

WORKDIR /app
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma

ENV PORT=3000
CMD ["sh", "-c", "yarn prisma generate && yarn prisma migrate deploy && node dist/apps/backend/src/main.js"]