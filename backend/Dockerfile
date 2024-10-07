FROM openjdk:17-oracle
WORKDIR /app

# Gradle 빌드 툴 설치 (Gradle 빌드가 필요한 경우)
RUN apt-get update && apt-get install -y gradle

# 프로젝트 파일 복사 및 빌드
COPY . .

# 빌드 명령 수행 (gradle 빌드를 통해 JAR 파일 생성)
RUN ./gradlew build

# JAR 파일 복사
ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# 포트 열기
EXPOSE 8080

# 실행 명령
ENTRYPOINT ["java", "-jar", "/app.jar"]
