const logger = require('../utility/logger');

const api = require('./api.config');
const engine = require('./engine');
const modules = require('./modules');

class Device {
    constructor() {
        this.start = () => {
            api.getConfig().then(config => {
                engine.start(config.schedule, data => {
                    logger.action(data);
                });
                
                modules.start(config.modules, data => {
                    logger.action(data);
                });
            });
        };
    };
};

module.exports = new Device;