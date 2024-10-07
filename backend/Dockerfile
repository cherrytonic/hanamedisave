FROM openjdk:17-oracle
EXPOSE 8080

# JAR 파일 복사
ARG JAR_FILE=build/libs/backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# orai18n.jar 포함된 libs 디렉토리 복사
COPY libs/ /app/libs/

# 애플리케이션 실행 시 orai18n.jar와 함께 모든 라이브러리를 클래스패스로 추가
ENTRYPOINT ["java", "-cp", "/app/libs/*:/app.jar", "org.springframework.boot.loader.JarLauncher"]
