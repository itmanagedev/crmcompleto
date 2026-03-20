# ==========================================
# Estágio 1: Build (Construtor)
# ==========================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (usando ci para builds mais limpos e rápidos)
RUN npm ci

# Copia o restante do código fonte
COPY . .

# Executa o build da aplicação (Vite gera os arquivos estáticos na pasta dist)
RUN npm run build

# ==========================================
# Estágio 2: Production (Produção)
# ==========================================
FROM nginx:alpine AS production

# Define a variável de ambiente para a porta (Easypanel e Cloud Run usam 3000 por padrão)
ENV PORT=3000

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Cria uma configuração customizada do Nginx para servir a SPA na porta 3000
RUN echo "server { \
    listen 3000; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    # Cache de assets estáticos \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control \"public, no-transform\"; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados do estágio anterior para o diretório do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 3000
EXPOSE 3000

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
