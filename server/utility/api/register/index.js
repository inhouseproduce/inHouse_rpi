const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const getIp = require('ip');

const handleJson = require('./handleJson');

let endpoint = 'https://webapp-inhouse.herokuapp.com/get/json';

class Api {
    constructor() {
        this.register = async callback => {
            // Make get request to register and get config
            this.request(endpoint, config => {
                // Handle saveing config json
                handleJson.saveJsonFile(config);
                // Callback Config json file
                callback(handleJson.getJsonFile());
            });
        };
    };

    request = async (endpoint, callback) => {
        let info = await this.collectData();
        let token = await this.generateToken(info);

        // Make request
        let request = await axios.get(endpoint, {
            headers: {
                Authorization: 'Bearer ' + token,
            }
        });
        callback(request.data);
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
        // generate token & return
        return await jwt.sign(data,
            'secret', { algorithm: 'HS256' });
    };
};

module.exports = new Api;