const Engine = require('./engines');
const Modules = require('./modules');
const Sensors = require('./sensors');

class InitializeComponents {
    constructor(logger, config) {
        this.engine = cb => {
            let engines = new Engine(logger);
            engines.start(config.engine, jobs => {
                cb(jobs);
            });
        }

        this.modules = cb => {
            let modules = new Modules(logger);
            modules.start(config.modules, jobs => {
                cb(jobs);
            });
        }

        this.sensors = cb => {
            let sensors = new Sensors(logger);
            sensors.start(config, jobs => {
                cb(jobs);
            });
        }
    }
};

module.exports = InitializeComponents;