const scheduler = require('../../utility/scheduler');
const gpio = require('../../utility/gpio/gpio');

const controller = require('./controller');

class Engine {
    constructor() {
        this.start = (data, logger) => {
            Object.keys(data).map(key => {
                let config = data[key];

                // Initialize Gpio pins based on config
                if (config.pin)
                    gpio.initializeGpio(config, true);

                if (config.pwd && config.pin)
                    gpio.initializePwm(config, 100);

                // Get scheduler type based on config
                let schedule = scheduler[config.type];
                let controll = controller[config.type];

                // Create cron job, runing schedule function
                let cronJobs = schedule(config, { int: true }, (action, job) => {
                    controll(config, action, job);
                });

                return cronJobs;
            });
        };
    };
};

module.exports = new Engine;