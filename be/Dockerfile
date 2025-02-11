# OpenJDK 17 Alpine 기반 이미지 사용
# FROM bellsoft/liberica-openjdk-alpine:17
# #
# CMD ["./gradlew", "clean", "build"]


# ARG JAR_FILE=build/libs/app.jar
# COPY ${JAR_FILE} ./app.jar

# EXPOSE 8080

# # 컨테이너 실행 시 .jar 파일 실행
# ENTRYPOINT ["java","-jar","/app.jar"]

# 1. 기본 이미지 설정
FROM bellsoft/liberica-openjdk-alpine:17 AS builder

# 2. 작업 디렉터리 설정
WORKDIR /app

# 3. 프로젝트의 모든 소스 복사
COPY . .

# 4. Gradle 빌드 수행 (이미지 빌드 단계에서 실행됨)
RUN ./gradlew clean build --no-daemon

# 5. JAR 파일을 런타임 이미지로 복사
FROM bellsoft/liberica-openjdk-alpine:17
ARG JAR_FILE=build/libs/app.jar

# 6. JAR 파일 복사
COPY --from=builder /app/${JAR_FILE} app.jar

# 7. 포트 노출
EXPOSE 8080

# 8. 실행 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]