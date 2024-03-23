FROM node:16-alpine

WORKDIR /app

#COPY package*.json ./
COPY ./package*.json .

RUN npm install

COPY . .

RUN npm install pm2 -g
RUN npm install ts-node -g 
RUN pm2 install typescript

# RUN npm run build

# EXPOSE 3001

CMD ["npm", "run", "start:prod"]