FROM node:8.16.2

WORKDIR /app

COPY package.json package.json

RUN npm install
COPY . ./

CMD ["node", "server/esp-gateway.js"]