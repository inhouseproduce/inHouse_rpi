FROM node:8.16.2

WORKDIR /app

COPY package.json package.json

RUN npm install
COPY . ./

ENV UDEV=1ß

CMD ["node", "server/esp-gateway.js"]