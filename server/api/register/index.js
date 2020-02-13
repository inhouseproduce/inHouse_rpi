const axios = require('axios');
const jwt = require('jsonwebtoken');

const store = require('../../../store');
const handleJson = require('./handleJson');

let endpoint = 'https://inhouse-app-test.herokuapp.com/client/identify/';


class Api {
    constructor() {
        this.register = async callback => {
            // Create Token with server data
            let token = await this.generateToken({
                client: process.env.RESIN_DEVICE_NAME_AT_INIT,
                uuid: process.env.BALENA_DEVICE_UUID,
                appId: process.env.BALENA_APP_ID
            });

            // Make get request to register and get config
            this.request(endpoint, token, async data => {
                // Save session token in store
                store.dispatch({ type: 'REGISTER_TOKEN', token: data.sessionToken });

                // Store client data in store
                let decoded = await jwt.verify(data.sessionToken, 'secret');
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
        catch (error) { throw error };
    };

    // Generate token
    generateToken = async data => {
        return await jwt.sign(data, 'secret', { algorithm: 'HS256' });
    };
};

module.exports = new Api;