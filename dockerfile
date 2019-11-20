FROM node:10.17.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node index.js