FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./
# npm build
RUN npm run build

# prod environment
FROM nginx:stable-alpine


COPY ./conf /etc/nginx/
# 이전 빌드 단계에서 빌드한 결과물을 /usr/share/nginx/html 으로 복사한다.
COPY --from=build /app/build /usr/share/nginx/html
# # 컨테이너의 80번 포트를 열어준다.
# EXPOSE 80

# nginx 서버를 실행하고 백그라운드로 동작하도록 한다.
CMD ["nginx", "-g", "daemon off;"]
