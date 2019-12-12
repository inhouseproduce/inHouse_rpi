
const CronJob = require('cron').CronJob;
const GPIO = require('rpio');

// Components 
const swtichers = require('./switchers');
const catcher = require('./stateCatcher');

// Helpers
const cronTimer = require('../helpers/cronTimer');

// GPIO settings
GPIO.init({ gpiomem: false });

class Scheduler {
    constructor() {
        this.interval = (config, action) => {
            // Initialize Gpio, Initially off by default
            this.initializeGpio(config);
            // Run initially
            swtichers.intervalSwitcher(config, action);
            // Run cron based on time_interval
            new CronJob(cronTimer.interval(config), () => {
                swtichers.intervalSwitcher(config, action);
            }).start();
        };

        this.clock = (config, action) => {
            // Initilaize GPIO pin
            this.initializeGpio(config);
            // Initialize pwm
            this.initializePwm(config);

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
            // Catch the current state / catcher module
            catcher.state(nextDates, job => {
                swtichers.clockSwitcher(config, action, job);
            });
        };
    };

    // initialize gpio
    initializeGpio(config, init) {
        let intState = GPIO[init ? 'LOW' : 'HIGH'];
        let direction = GPIO[config.direction];
        let pin = config.pin;
        GPIO.open(pin, direction, intState);
    };

    // initialize pwm
    initializePwm(config) {
        // initialzie pwm
        GPIO.open(config.pwm, GPIO.PWM);
        // initialzie ~Hz
        GPIO.pwmSetClockDivider(256);
        // set total pwm range
        GPIO.pwmSetRange(config.pwm, 100);// set the range
        // initially 100% brigtness
        GPIO.pwmSetData(config.pwm, 100);
    };
};

module.exports = new Scheduler;