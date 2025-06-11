FROM node:20-alpine as builder

WORKDIR /app

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

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN yarn workspace frontend build

FROM node:20-alpine as runner

WORKDIR /app

COPY --from=builder /app/apps/frontend/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/packages/types/dist ./packages/types/dist/
COPY --from=builder /app/apps/frontend/public ./public/

ENV PORT=5173

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'sed -i "s|VITE_API_URL=.*|VITE_API_URL=$VITE_API_URL|g" /app/dist/index.html' >> /app/start.sh && \
    echo 'npx serve -s dist -p 5173' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"] 