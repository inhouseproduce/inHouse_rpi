const scheduler = require('../../scheduler')
const camera = require('./camera');
const network = require('../../network');

class Modules {
    constructor() {
        this.start = (config, logger) => {
            this.initialize(config, key => {
                let actionType = this[key];
                actionType(config[key], action => {
                    logger({ action, key });
                });
            });
        };

        this.initialize = (config, ready) => {
            network.setNetworkList();
            Object.keys(config).map(key => {
                console.log('modules has been initialized')
                ready(key);
            });
        };
    };

    camera = (config, action) => {
        camera.initializeEsps(config, action);
        // Start cron pass arg - config, option, action
        scheduler.interval(config, { int: false }, () => {
            camera.captureImage(config, action);
        });
    };
};

module.exports = new Modules;