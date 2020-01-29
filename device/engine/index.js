const scheduler = require('../../utility/scheduler');

const controller = require('./controller');
const state = require('./state');
const gpio = require('../../utility/gpio/gpio');

class Engine {
    constructor() {
        this.start = (schedule, logger) => {
            Object.keys(schedule).map(key => {
                this.engine(schedule[key], action => {
                    logger({ action, key });
                });
            });
        };
    };

    engine = (config, action) => {
        // Initialize Gpio pins based on config
        if (config.pin)
            gpio.initializeGpio(config, true);

        if (config.pwd && config.pin)
            gpio.initializePwm(config, 100);

        // Get scheduler type based on config
        let schedule = scheduler[config.type];
        let controll = controller[config.type];

        // Create cron job, runing schedule function
        let cronDates = schedule(config, { int: true }, () => {
            controll(config, action);
        });

        // If type is clock catch the current state
        // ** Might need better logic (no if statement)
        if (config.type === 'clock') {
            state.catch(cronDates, job => {
                controller[config.type](config, action, job);
            });
        };
    };
};

module.exports = new Engine;