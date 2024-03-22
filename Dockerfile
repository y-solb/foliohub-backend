FROM node:14.14.0-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

CMD ["pm2", "start", "dist/index.js"]