const request = require('axios');
const fs = require('fs');

class Api {
    constructor() {
        this.url = 'https://webapp-inhouse.herokuapp.com/get/json';

        this.getConfig = async () => {
            return await request.get(this.url).then(res => {
                // First Save file than get the file and return
                this.saveJsonFile(res.data);
                // Return config file based on validity (saved.json || default.json)
                return this.getConfigFile();

            }).catch(error => {
                if (error) return this.getConfigFile();
            });
        };
    };

    saveJsonFile(data) {
        // config file validation
        let isValid = this.validateConfig(data);

        if (isValid) {
            // Convert to json and save
            let config = JSON.stringify(data);
            // Save to saved.json file
            let saveTo = './config.api/configs/saved.json';
            fs.writeFileSync(saveTo, config);
        }
        else {
            console.log('Config file is not valid');
        };
    };

    // Return valid config.json/ lastest or default
    getConfigFile(data) {
        // Get saved.json config file and validate
        let savedConfig = require('./configs/saved.json');
        let isValid = this.validateConfig(savedConfig);

        if (isValid) {
            return savedConfig;
        };
        // Return Default.json file
        return require('./configs/default.json');
    };

    // Validates config type
    validateConfig(config) {
        // Validate if type is object
        if (config && typeof config === 'object') {
            return true;
        };
        return false
    };
};

module.exports = new Api;