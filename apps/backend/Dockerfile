FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/

RUN yarn install
RUN yarn add -D prisma

COPY . .

RUN yarn workspace backend prisma generate
RUN yarn workspace backend build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN yarn add -D prisma
RUN yarn prisma generate

ENV PORT=3000
CMD ["sh", "-c", "yarn prisma migrate deploy && node dist/main.js"]
