const jwt = require('jsonwebtoken');
const axios = require('axios');
const ip = require('ip');

const config = require('./config');
const store = require('../store');

const jwksClient = require('jwks-rsa');

const { REGISTER_TOKEN } = require('../store/actionTypes');

class Api {
    constructor() {
        this.getConfig = () => {
            config.getConfig();
        };

        this.registerServer = async () => {
            const endpoint = 'http://localhost:3000/client/identify/';
            const sessionId = '123213213';

            // Create identification token
            let bearer = await this.signToken({ sessionId });

            // Request to endpoint for identification
            this.request({ endpoint, bearer });

            // verify if identified
            // let sesstion = await this.verifyToken(askVerify.data.sesstion);
            // let verify = await this.verifyToken(sesstion.data.oldToken);

            // store.dispatch({ type: REGISTER_TOKEN, sesstion });
        };
    };

    signKey = async () => {
        let test = await jwt({
            // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
            secret: jwksRsa.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `http://localhost:3000/client/identify/`
            }),

            // Validate the audience and the issuer.
            audience: 'urn:localhost:3000',
            issuer: 'https://localhost:3000/',
            algorithms: ['RS256']
        });
        console.log('tesint', test)
    };

    request = async data => {
        return await axios.post(data.endpoint, {
            params: data.params
        }, {
            headers: {
                'Authorization': 'Bearer ' + data.bearer
            }
        });
    };

    signToken = async data => {
        try {
            return await jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: { ...data }
                },
                'secret'
            );
        }
        catch (err) {
            return 'Can not sign in token'
        };
    };

    verifyToken = async (token) => {
        try {
            return await jwt.verify(token, 'secret');
        }
        catch (err) {
            return 'Can not verify token';
        };
    };
};

module.exports = new Api;