# Usar imagem que combina Node.js com Nginx
FROM node:16 AS base

WORKDIR /app

# Instalar dependências e construir o backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production
COPY backend/ .
RUN npm run build

# Instalar dependências e construir o frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Etapa final usando Nginx para frontend e Node.js para backend
FROM nginx:stable
WORKDIR /app
COPY --from=base /app/frontend/build /usr/share/nginx/html
COPY --from=base /app/backend /app/backend
WORKDIR /app/backend

# Expor portas
EXPOSE 80
EXPOSE 8080

# Comando para rodar Node.js (backend) e Nginx (frontend)
CMD ["sh", "-c", "node dist/index.js & nginx -g 'daemon off;'"]
