FROM node:18-alpine

WORKDIR /app

# Instala ferramentas necessárias para dependências nativas (se houver)
RUN apk add --no-cache openssl

# Copia arquivos de configuração e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e o diretório prisma
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Compila o projeto TypeScript
RUN npm run build

EXPOSE 3001

# Script de inicialização para rodar migrações, seed e iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
