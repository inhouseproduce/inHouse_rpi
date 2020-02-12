const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const getIp = require('ip');

const store = require('../../../../store');
const handleJson = require('./handleJson');

let endpoint = 'https://inhouse-app-test.herokuapp.com/client/identify/';

class Api {
    constructor() {
        this.register = async callback => {
            // Get Client server data
            let info = await this.collectData();

            // Create Token with server data
            let token = await this.generateToken(info);

            // Make get request to register and get config
            this.request(endpoint, token, async data => {
                let { sessionToken, client } = data;

                // Save session token in store
                store.dispatch({ type: 'REGISTER_TOKEN', token: sessionToken });

                // Store client data in store

                let decoded = await jwt.verify(sessionToken, 'secret');
                store.dispatch({ type: 'SET_CLIENT', client: decoded });

                // Handle saveing config json
                //handleJson.saveJsonFile(config.config);

                // Callback Config json file
                callback(handleJson.getJsonFile());
            });
        };
    };

    request = async (endpoint, token, callback) => {
        try {
            // Make request
            let request = await axios.get(endpoint, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
            callback(request.data);
        }
        catch(error){ throw error};
    };

    // Collect data
    collectData = async () => {
        // Get client config data
        let { client } = await handleJson.getJsonFile();

        // Generate rendome key
        let key = await crypto.randomBytes(48).toString('hex');

        // Get Ip address
        let ip = await getIp.address();

        // Return object data
        return { client, key, ip };
    };

    // Generate token
    generateToken = async data => {
        return await jwt.sign(data, 'secret', { algorithm: 'HS256' });
    };
};

module.exports = new Api;