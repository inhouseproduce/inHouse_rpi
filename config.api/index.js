const axios = require('axios');
const defaultConfig = require('../device/config.json');

module.exports = async () => {
    const url = 'https://webapp-inhouse.herokuapp.com/get/json';

    return await axios.get(url).then(res => {
        return res.data;
    })
    .catch(error => {
        if (error) {
            console.log('connection error, using default config');
            return defaultConfig;
        }
    });
};