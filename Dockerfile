FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# TypeScript'i derle
RUN npm run build

EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"] 