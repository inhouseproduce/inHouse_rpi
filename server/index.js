const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

class Server {
    constructor() {
        this.start = sysOp => {
            server(sysOp);
        };
    };

    server = () => {
        const PORT = 3000;
        const app = express();

        app.use(bodyParser.json());

        routes(app, sysOp);

        app.listen(PORT, () => {
            console.log(`🌎 ==> Server now on port ${PORT}!`);
        });
    };
};

module.exports = new Server;