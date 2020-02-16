const gpio = require('../../utility/gpio');

class Controller {
    constructor() {
        this.initialize = (config, action) => {
            if (config.pin) {
                gpio.initializeGpio(config, true);
                action('Gpio has been initialzied')
            };

            if (config.pwd && config.pin) {
                gpio.initializePwm(config, 100);
                action('PWM has been initialzied')
            };
        };

        // Interval Action
        this.interval = (config, job, action) => {
            if (config.pin) {
                gpio.writeGpio(config, true);
                action('On');
            };

            // Off based on Run_period
            if (config.run_period) {
                setTimeout(() => {
                    if (config.pin) {
                        gpio.writeGpio(config, false);
                        action('Off');
                    };
                }, config.run_period * 60000);
            };
        };


        // Clock Action
        this.clock = (config, job, action) => {
            action(job.action);
            // Gpio switcher 
            if (job.action === 'on' || job.action === 'off') {
                let switcher = job.action === 'on' ? true : false;
                gpio.writeGpio(config, switcher);
            };

            // Set pwm intensity (brigtness)
            if (job.action === 'dim') {
                gpio.initializeGpio(config, true);
                gpio.initializePwm(config);
                gpio.writePwm(config, job.level);
            };
        };
    };
};

module.exports = new Controller;