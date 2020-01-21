const scheduler = require('../../scheduler')
const camera = require('./camera');

class Modules {
    constructor() {
        this.start = (config, action) => {
            Object.keys(config).map(component => {
                let actionType = this[component];
                actionType(config[component], action);
            });
        };
    };

    camera = (config, action) => {
        camera.initializeEsps(config, action);
        // Start cron pass arg - config, option, action
        scheduler.interval(config, { int: false }, () => {
            camera.captureImage(config, {
                capture: true,
                sleep: config.time_interval
            });
        });
    };
};

module.exports = new Modules;