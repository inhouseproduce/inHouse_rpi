const request = require('axios');
const fs = require('fs');

module.exports.getConfig = async () => {
    let url = url = 'https://webapp-inhouse.herokuapp.com/get/json';

    return await request.get(url).then(res => {
        // First Save file than get the file and return
        saveJsonFile(res.data);
        // Return config file based on validity (saved.json || default.json)
        return getConfigFile();

    }).catch(error => {
        if (error) return getConfigFile();
    });
};

const saveJsonFile = (data) => {
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
const getConfigFile = (data) => {
    // Get saved.json config file and validate
    let savedConfig = require('./configs/saved.json');
    let isValid = validateConfig(savedConfig);

    if (isValid) {
        console.log('Saved file')
        return savedConfig;
    };
    // Return Default.json file
    console.log('config file')
    return require('./configs/default.json');
};

// Validates config type
const validateConfig = (config) => {
    // Validate if type is object
    if (config && typeof config === 'object') {
        return true;
    };
    return false
};