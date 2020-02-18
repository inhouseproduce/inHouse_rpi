const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');

const routes = require('./routes');
const api = require('./api');

class Server {
    constructor() {
        this.registerServer = callback => {
            // Register server api
            api.register(async config => {
                const PORT = process.env.PORT || 80;
                const app = express();

                // Body
                app.use(logger('dev'));
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use(bodyParser.json({ limit: '1mb' }));

                // Headers
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

                // Initialize Routes
                routes.initializeRoutes(app);

                // Server Listen
                app.listen(PORT, () => {
                    callback(config);
                });
            });
        };
    };
};

module.exports = new Server;