FROM node:8.16.2
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node index.js
