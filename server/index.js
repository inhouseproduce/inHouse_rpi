const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

class Server {
    constructor(dev) {
        let { store } = dev;

        this.start = () => {
            const PORT = 3000;
            const app = express();

            app.use(bodyParser.json());

            routes(app, store);

            app.listen(PORT, () => {
                console.log(`🌎 ==> Server now on port ${PORT}!`);
            });
        };
    };
};

module.exports = Server;