const axios = require('axios');

class Api {
    constructor() {
        this.register = async cb => {
            this.registerRequest(config => {
                this.saveJsonFile(config);
                cb(this.getConfigFile());
            });
        };
    };

    registerRequest = callback => {
        let url = 'https://webapp-inhouse.herokuapp.com/get/json';
        let request = await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + 'token'
            }
        });
        callback(request.data);
    };

    saveJsonFile = (data) => {
        if (this.validateConfig(data)) {
            // Convert to json and save
            let config = JSON.stringify(data);
            // Save to saved.json file
            let saveTo = './configs/saved.json';
            fs.writeFileSync(saveTo, config);
        }
        else {
            console.log('Config file is not valid');
        };
    };

    // Return valid config.json/ lastest or default
    getConfigFile = (data) => {
        // Get saved.json config file and validate
        let savedConfig = require('./configs/saved.json');
        let isValid = this.validateConfig(savedConfig);

        if (isValid) {
            console.log('Saved file')
            return savedConfig;
        };

        return require('./configs/default.json');
    };

    // Validates config type
    validateConfig = config => {
        // Validate if type is object
        if (config && typeof config === 'object') {
            return true;
        };

        return false
    };
};

module.exports = new Api;