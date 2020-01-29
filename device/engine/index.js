const scheduler = require('../../utility/scheduler');
const gpio = require('../../utility/gpio/gpio');

const controller = require('./controller');

class Engine {
    constructor() {
        this.start = (data, logger) => {
            let jobList = {};

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

                // Schedule a job based on config type
                let cronJobs = schedule(config, { int: true }, (action, job) => {
                    controll(config, action, job);
                });

                // Jet jobs to jobList object
                cronJobs.map(job => {
                    jobList[key] = job;
                });
            });
            // Return created cron jobs
            return jobList;
        };
    };
};

module.exports = new Engine;