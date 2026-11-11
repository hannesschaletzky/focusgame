# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 DB_PATH=/data/focus.db
WORKDIR /app
# standalone enthält nur, was der Server braucht; static und public liefert Next nicht automatisch mit
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# SQLite-Datei liegt im Volume /data. Der Ordner gehört node, damit ein neues Volume die Rechte übernimmt
RUN mkdir /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 3000
CMD ["node", "server.js"]
