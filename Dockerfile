# ==========================================
# Estágio 1: Build da Aplicação
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências primeiro (melhora o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia todo o código fonte
COPY . .

# Executa o build (gera a pasta /dist)
RUN npm run build

# ==========================================
# Estágio 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Cria uma configuração simples e à prova de falhas para React/Vite na porta 3000
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Redireciona todas as rotas para o index.html (essencial para React Router) \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no estágio 1 para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 3000
EXPOSE 3000

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]

