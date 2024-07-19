FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install pm2 -g

RUN NODE_OPTIONS=--max-old-space-size=4096

RUN npm run build

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
