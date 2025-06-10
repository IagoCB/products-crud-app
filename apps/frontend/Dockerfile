FROM node:18-alpine

WORKDIR /app

# Habilitar o Corepack e configurar o Yarn
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock ./
COPY packages/types ./packages/types
COPY apps/frontend ./apps/frontend

RUN yarn install

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["yarn", "dev", "--host"] 