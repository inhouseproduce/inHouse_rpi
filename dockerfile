FROM node:12.12.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node server.js
