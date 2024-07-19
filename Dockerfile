FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install pm2 -g

RUN npm run build

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
