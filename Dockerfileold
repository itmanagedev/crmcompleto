# ==========================================
# Dockerfile para Aplicação Fullstack (Express + React/Vite)
# ==========================================
FROM node:20-alpine

# Instala dependências do sistema necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl libc6-compat

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies, mesmo se NODE_ENV=production for injetado pelo Easypanel)
RUN npm install --include=dev

# Copia todo o código fonte para dentro do container
COPY . .

# Gera o client do Prisma para o ambiente Alpine do Docker
RUN npx prisma generate

# Executa o build do frontend (O Vite vai gerar os arquivos estáticos na pasta /dist)
# Adicionamos --if-present caso o script de build falhe silenciosamente
RUN npm run build --if-present

# Define as variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000

# Expõe a porta 3000 (Padrão do Easypanel)
EXPOSE 3000

# Inicia o servidor Express usando o TSX
# O Express vai servir tanto as rotas da API (/api/*) quanto o frontend estático (/dist)
CMD ["npx", "tsx", "server.ts"]



