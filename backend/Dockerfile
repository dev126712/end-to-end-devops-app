FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json  ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json  ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/todos.json ./todos.json

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

#RUN chown backend:nodejs /app/todos.json

USER backend

EXPOSE 5000

ENV PORT 5000
ENV NODE_ENV production
#CMD ["node", "dist/server.ts"]
CMD ["npm", "start"]

#FROM node:20-alpine
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#EXPOSE 5000
#CMD ["npm", "start"]
