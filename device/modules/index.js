const scheduler = require('../../scheduler')
const camera = require('./camera');

class Modules {
    constructor() {
        this.start = (config, logger) => {
            this.initialize(config, key => {
                this[key](config[key], action => {
                    logger({ action, key });
                });
            });
        };

        this.initialize = (config, ready) => {
            Object.keys(config).map(key => {
                console.log(`${key} Module has been initialized`);
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