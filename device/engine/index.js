const scheduler = require('../../scheduler');
const controller = require('./controller');
const state = require('./state');
const gpio = require('./gpio');

class Engine {
    constructor() {
        this.start = (schedule, logger) => {
            Object.keys(schedule).map(key => {
                let config = schedule[key];
                let actionType = this[config.type];

                // Initialize gpios
                gpio.initializeGpio(config, true);
                gpio.initializePwm(config, 100);

                actionType(config, action => {
                    logger({ action, key });
                });
            });
        };
    };

    interval = (config, action) => {
        scheduler.interval(config, { int: true }, () => {
            let controll = controller[config.type];
            controll(config, action);
        });
    };

    clock = (config, action) => {
        // Map clock action list, create schedule for each job
        let nextDates = config.actions.map(job => {
            let cronDates = scheduler.clock(job, () => {
                let controll = controller[config.type];
                controll(config, action, job);
            });
            return { date: cronDates.nextDates(), job: job };
        });

        // Catch current state / catcher module
        state.catch(nextDates, job => {
            controller[config.type](config, action, job);
        });
    };
};

module.exports = new Engine;