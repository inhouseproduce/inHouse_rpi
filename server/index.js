const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

class Server {
    constructor(dev) {
        this.start = () => {
            const PORT = 3000;
            const app = express();

            app.use(bodyParser.json());

            routes(app, dev);

            app.listen(PORT, () => {
                console.log(`🌎 ==> Server now on port ${PORT}!`);
            });
        };
    };
};

module.exports = Server;