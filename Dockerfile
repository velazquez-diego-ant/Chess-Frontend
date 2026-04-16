FROM maven:3.9.9-eclipse-temurin-04

WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline -B

EXPOSE 8080

CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.profiles=dev"]