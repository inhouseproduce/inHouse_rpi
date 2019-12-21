
const CronJob = require('cron').CronJob;

// Components 
const swtichers = require('./switchers');
const catcher = require('./stateCatcher');

// Helpers
const cronTimer = require('../helpers/cronTimer');
const gpio = require('../helpers/gpio');

class Scheduler {
    constructor() {
        this.interval = (config, action) => {
            // Initialize Gpio, Initially off by default
            gpio.initializeGpio(config, true);
            // Run initially
            swtichers.intervalSwitcher(config, action);
            // Run cron based on time_interval
            new CronJob(cronTimer.interval(config), () => {
                swtichers.intervalSwitcher(config, action);
            }).start();
        };
 
        this.clock = (config, action) => {
            // Initilaize GPIO pin && pwm
            gpio.initializeGpio(config, true);
            gpio.initializePwm(config, 100);

            // Map all actions
            let nextDates = config.actions.map(job => {
                // Create cron job for each action
                let cron = new CronJob(cronTimer.clock(job), () => {
                    swtichers.clockSwitcher(config, action, job);
                });
                // Start the cron 
                cron.start();
                // Return next dates in map functon
                return {
                    date: cron.nextDates(),
                    job: job
                }
            });
            // Catch current state / catcher module
            catcher.state(nextDates, job => {
                swtichers.clockSwitcher(config, action, job);
            });
        };
    };
};

module.exports = new Scheduler;