FROM node:16-alpine

WORKDIR /app
RUN mkdir -p uploads

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install pm2 -g

CMD ["npm", "run", "start:production"]
# MD ["npm", "run", "dev"]
#CMD ["pm2-runtime", "start", "ecosystem.config.js"]
