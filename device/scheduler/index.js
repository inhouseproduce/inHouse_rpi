const CronJob = require('cron').CronJob;

// Helpers
const cronTimer = require('../helpers/cronTimer');
const gpio = require('../helpers/gpio');

// Components 
const swtichers = require('./switchers');
const catcher = require('./stateCatcher');
const esp = require('./esp');

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
                cron.start();
                // Return next dates from map functon
                return { date: cron.nextDates(), job: job }
            });
            // Catch current state / catcher module
            catcher.state(nextDates, job => {
                swtichers.clockSwitcher(config, action, job);
            });
        };

        this.request = async (config, action) => {
            esp.initializeEsps(config, { scan: true });

            // Start cron schedule
            new CronJob(cronTimer.interval(config), () => {
                esp.captureImage(config, {
                    capture: true,
                    sleep: config.time_interval
                });
            }).start();
        };
    };
};

module.exports = new Scheduler;