FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production
COPY . .
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]