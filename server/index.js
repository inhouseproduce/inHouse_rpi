const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const axios = require('axios');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtToken = require('jsonwebtoken');

const routes = require('./routes');

class Server {
    constructor() {
        this.registerServer = sysOp => {
            this.identifyToServer(() => {
                this.startServer(app => {

                });
            });
        };
    };

    startServer = (cb) => {
        const PORT = process.env.PORT || 3000;
        const app = express();

        app.use(bodyParser.json());
        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '2mb' }));

        routes(app);

        app.listen(PORT, () => {
            console.log(`🌎 ==> Server now on port ${PORT}!`);
        });
        cb();
    };

    identifyToServer = async (cb) => {
        let token = await jwtToken.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: { client: 'hugos' }
        }, 'secret');

        let request = await axios.get('http://localhost:3000/client/identify/', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        let sesstionToken = request.data.session;
        jwtToken.verify(sesstionToken, 'secret', async (err, decoded) => {
            console.log('decde', decoded)
        });
        cb();
    };
};

module.exports = new Server;