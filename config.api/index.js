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
            fs.writeFileSync('./config.api/configs/saved.json', config);
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




//**** Descritpion
// 1. Makes a requrest to url to get json file
// 2. If json file is valid save in saved.json file
// 3. Then read from saved.json file and return
// 4. If error occured get saved.json validate and return 
// 5. If saved.json file is not valid than get default default.json

//* 3 functions */
// 1. saveJsonFile --- validates and saves file to saved.json
// 2. getDefaultConfig --- first read saved.json file if valid return else return default.json file
// 3. validateConfig --- validates if type is object