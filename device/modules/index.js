const scheduler = require('../../utility/scheduler')
const camera = require('./camera');

class Modules {
    constructor() {
        this.start = (config, logger) => {
            Object.keys(config).map(opp => {
                let action = this[opp];

                action(config[opp], action => {
                    logger({ action, opp });
                });
            });
        };
    };

    camera = (config, action) => {
        // Initialize cameras
        camera.start(config, job => {
            scheduler.interval(config, { int: false }, () => {
                job(config);
            });
        });
    };
};

module.exports = new Modules;