# OpenJDK 17 Alpine 기반 이미지 사용
# FROM openjdk:17-jdk-alpine
FROM bellsoft/liberica-openjdk-alpine:17

CMD ["./gradlew", "clean", "build"]


ARG JAR_FILE=build/libs/app.jar
COPY ${JAR_FILE} ./app.jar

EXPOSE 8080

# 컨테이너 실행 시 .jar 파일 실행
ENTRYPOINT ["java","-jar","/app.jar"]