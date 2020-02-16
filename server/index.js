const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const logger = require('morgan');

const routes = require('./routes');
const api = require('./api');

class Server {
    constructor() {
        this.registerServer = callback => {
            api.register(async config => {
                this.server(() => {
                    callback(config);
                });
            });
        };
    };

    server = callback => {
        const PORT = process.env.PORT || 80;
        const app = express();

        this.mongoDB();
        this.headers(app);

        routes(app);

        app.listen(PORT, () => {
            callback();
        });
    };

    headers = app => {
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
    };

    mongoDB = () => {
        const MONGODB_URI = 'mongodb://inhouse_produce:edo883562616@ds139951.mlab.com:39951/heroku_6nb1v7c3';
        mongoose.set('useCreateIndex', true);

        const mdbConfig = {
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        };

        mongoose.connect(MONGODB_URI, mdbConfig);
        mongoose.connection.once('open', () => {
            console.log('mongoose connection successful');
        });
    };
};

module.exports = new Server;