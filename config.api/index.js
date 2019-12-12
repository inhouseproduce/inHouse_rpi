const request = require('axios');
const fs = require('fs');

module.exports = async () => {
    const url = 'https://webapp-inhouse.herokuapp.com/get/son';

    return await request.get(url).then(res => {
        // Save file than get the file and return
        saveJsonFile(res.data);
        return getDefaultConfig();
    })
        .catch(error => {
            if (error) return getDefaultConfig();
        });

    // Save json file to current direcotry
    function saveJsonFile(data) {
        // config file validation
        let isValid = validateConfig(data);

        if (isValid) {
            // Convert to json and save
            let config = JSON.stringify(data);
            fs.writeFileSync('./config.api/saved.json', config);
        } 
        else {
            console.log('Config file is not valid');
        };
    };

    // Return valid config.json/ lastest or default
    function getDefaultConfig() {
        // Get saved.json config file and validate
        let savedConfig = require('./saved.json');
        let isValid = validateConfig(savedConfig);

        if (isValid) {
            return savedConfig;
        };
        // Return Default.json file
        return require('./default.json');
    };

    // Validates config type
    function validateConfig(config) {
        // Validate if type is object
        if (config && typeof config === 'object') {
            return true;
        };
        return false
    };
};



//**** Descritpion
// 1. Makes a requrest to url to get json file
// 2. If json file is valid save in saved.json file
// 3. Then read from saved.json file and return
// 4. If error occured get saved.json validate and return 
// 5. If saved.json file is not valid than get default default.json

//* 3 functions */
// 1. saveJsonFile --- validates and saves file to saved.json
// 2. getDefaultConfig --- first read saved.json file if valid return else return           default.json file
// 3. validateConfig --- validates if type is object