const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const routes = require('./routes');
const api = require('./utility/api');

class Server {
    constructor() {
        this.registerServer = cb => {
            api.register(config => {
                this.server();
                cb(config);
            });
        };
    };

    server = () => {
        const PORT = process.env.PORT || 3000;
        const app = express();

        (function serverHeaders() {
            app.use(logger('dev'));
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json({ limit: '1mb' }));

            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header(
                    'Access-Control-Allow-Headers',
                    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                );

                if (req.method === 'OPTIONS') {
                    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                    return res.status(200).json({});
                };
                next();
            });
        });

        routes(app);

        app.listen(PORT, () => {
            console.log(`🌎 ==> Server now on port ${PORT}!`);
        });
    };
};

module.exports = new Server;