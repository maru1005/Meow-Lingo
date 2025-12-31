FROM node:20-alpine

WORKDIR /app

# package.json のみ先にコピー → npm install（キャッシュ効く）
COPY package*.json ./
RUN npm install

# 残りのコードをコピー
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]