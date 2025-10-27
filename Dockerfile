FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache wget curl

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

