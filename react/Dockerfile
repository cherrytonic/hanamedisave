FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run build

# 빌드된 파일을 /app/build에 생성
