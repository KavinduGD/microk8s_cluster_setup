# Angular App Containerization

- use to build single page application (SPA)
- Build by google

## Angular vs React

- Angular is a framework, React is a library
- Angular has own cli, React has create-react-app

```Dockerfile
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/my-angular-app/browser /usr/share/nginx/html

EXPOSE 80
```

- npm run build behind the scene will use angular cli to build the app
- angular cli is installed in node modules, so we can use it in npm scripts
- The first -- : Tells npm that everything after it should be passed directly to the underlying script instead of npm itself.
- --configuration production : Passed to the build tool (typically Angular CLI). Equivalent to: `ng build --configuration` production
