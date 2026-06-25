# Containerizing a Spring Boot Application with Docker

## Project structure

```
project-root/
│
├── src/
├── target/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── HELP.md
└── readme.md
```

1. src/main : Contains the Java source code for the Spring Boot application.
2. src/test : Contains the unit tests for the application.
3. target : This directory is generated after building the project and contains the compiled classes and the packaged JAR file.
4. pom.xml : The Maven configuration file that defines the project dependencies and build configuration.
5. mvnw and mvnw.cmd : These are the Maven Wrapper scripts that allow you to run Maven commands without having Maven installed on your system. They will download the correct version of Maven if it's not already present.

---

## Dockerize the application

### using Single Stage Dockerfile

```Dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

RUN cp target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### using Multi Stage Dockerfile

```Dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/\*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

- 🛑 JDK is not required to run Jar file

### What are the differences between Single Stage and Multi Stage Dockerfiles?

1. **Build Process**: In a Single Stage Dockerfile, the application is built and run in the same stage, which means that all the build tools and dependencies are included in the final image. In contrast, a Multi Stage Dockerfile separates the build process into multiple stages, allowing you to use a lightweight base image for the final stage that only contains the necessary runtime dependencies.

2. **Image Size**: Single Stage Dockerfiles typically result in larger images because they include all the build tools and dependencies. Multi Stage Dockerfiles can significantly reduce the image size by only including the necessary runtime dependencies in the final image.

3. **Security**: Multi Stage Dockerfiles can enhance security by minimizing the attack surface of the final image. By excluding build tools and unnecessary dependencies, you reduce the potential vulnerabilities that could be exploited.

4. **Build Time**: Single Stage Dockerfiles may have faster build times since everything is done in one stage. However, Multi Stage Dockerfiles can take longer to build due to the additional stages and copying of artifacts between stages.
