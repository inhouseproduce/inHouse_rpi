const https = require('https');
const http = require('http');
const pem = require('pem');

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
                this.headers(app);

                // Create server
                http.createServer((req, res) => {
                    res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url });
                    res.end();
                }).listen(80);

                // Make sure request comes from https origin
                app.get('*', (request, response, next) => {
                    if (!request.secure) {
                        response.redirect('https://localhost:443');
                    } else {
                        next();
                    }
                });

                // Generate certificates
                pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
                    if (err) { throw err };

                    // Initialize Routes
                    routes.initializeRoutes(app);

                    // Https server with certificate
                    https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(443, () => {
                        callback(config);
                    });
                });
            });
        };
    };

    headers = app => {
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
};

module.exports = new Server;