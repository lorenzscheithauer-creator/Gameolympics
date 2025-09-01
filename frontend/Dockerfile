# Build Stage
FROM node:lts-alpine AS build-stage
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

# Production Stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Kopiere die neue Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
