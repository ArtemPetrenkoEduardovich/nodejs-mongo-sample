FROM node:18-alpine as production-dependencies
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:18-alpine as build-dependencies
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=build-dependencies /app/node_modules node_modules
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=production-dependencies /app .
COPY --from=builder /app/build /app/build
CMD [ "node", "build/index.js" ]
