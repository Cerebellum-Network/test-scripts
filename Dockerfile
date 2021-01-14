FROM node:12.18.4-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx tsc
