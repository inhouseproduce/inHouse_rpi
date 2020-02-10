class HandleConfigFile {
    constructor() {
        this.getJsonFile = () => {
            // Get saved.json config file and validate
            let savedConfig = require('./configs/saved.json');
            let isValid = this.validateConfig(savedConfig);

            if (isValid) {
                return savedConfig;
            }
            else {
                let defaultConfig = require('./configs/default.json');
                let defIsValid = this.validateConfig(defaultConfig);
                if (defIsValid) {
                    return defaultConfig;
                }
                else {
                    console.log('No Config File');
                };
            };
        };

        this.saveJsonFile = (data) => {
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

module.exports = new HandleConfigFile;