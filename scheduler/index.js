
const CronJob = require('cron').CronJob;

const GPIO = require('rpio');
// GPIO settings
GPIO.init({ gpiomem: false });

const catcher = require('./catcher');

class Scheduler {
    constructor() {
        this.interval = (config, action) => {
            // Initialize Gpio, Initially off by default
            GPIO.open(config.pin, GPIO[config.direction], GPIO.HIGH);

            // Run initially
            this.intervalSwitcher(config, action);

            // Run cron based on time_interval
            new CronJob(`0 */${config.time_interval} * * * *`, () => {
                this.intervalSwitcher(config, action);
            }).start();
        };


        this.clock = (config, action) => {
            // Check current state and run
            catcher.state(config);

            // Initilaize GPIO pin
            GPIO.open(config.pin, GPIO[config.direction], GPIO.HIGH);
            // initialzie pwm
            GPIO.open(config.pwm, GPIO.PWM)
            // initialzie ~Hz
            GPIO.pwmSetClockDivider(256);
            // set total pwm range
            GPIO.pwmSetRange(config.pwm, 100);// set the range
            // initially 100 (brigtness)
            GPIO.pwmSetData(config.pwm, 100);

            // Map all actions
            config.actions.map(job => {
                // Parse Date times
                let { hour, minute, second } = this.timeParser(job.time);

                // Start the cron job
                new CronJob(`${second} ${minute} ${hour} * * *`, () => {
                    this.clockSwitcher(config, action, job);
                }).start();
            });
        };
    };

    // Clock Action
    clockSwitcher(config, action, job) {
        // Action switcher
        if (action.on && action.off)
            action[job.action]();

        // Gpio switcher 
        if (job.action === 'on' || job.action === 'off')
            GPIO.write(config.pin, GPIO[(
                job.action === 'on' ? 'LOW' : 'HIGH'
            )]);

        // Set pwm intensity (brigtness)
        if (job.action === 'dim')
            GPIO.pwmSetData(config.pwm, Number(job.action.level));
    };

    // Interval Action
    intervalSwitcher(config, action) {
        if (action.on && action.off)
            action.on();
        if (config.pin)
            GPIO.write(config.pin, GPIO.LOW);

        // Off based on Run_period
        setTimeout(() => {
            if (action.on && action.off)
                action.off();
            if (config.pin)
                GPIO.write(config.pin, GPIO.HIGH);
        }, config.run_period * 60000);
    };


    //* ------------ Helpers --------------- *//
    timeParser(data) {
        let time = data.split(':');
        return {
            hour: time[0],
            minute: time[1] ? time[1] : '00',
            second: time[2] ? time[2] : '00'
        };
    };
};

module.exports = new Scheduler;