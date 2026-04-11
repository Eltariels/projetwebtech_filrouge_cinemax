FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY apps/api ./apps/api

EXPOSE 3000

CMD ["node", "apps/api/src/index.js"]
