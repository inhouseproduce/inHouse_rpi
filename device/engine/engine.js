const gpio = require('../../utility/gpio');

class Controller {
    constructor() {
        this.initialize = (config, action) => {
            if (config.pin) {
                gpio.initializeGpio(config, true);
                action({ pin: config.pin });
            };

            if (config.pwd && config.pin) {
                gpio.initializePwm(config, 100);
                action({ pwm: config.pwm });
            };
        };

        // Interval Action
        this.interval = (config, job, action) => {
            if (config.pin) {
                gpio.writeGpio(config, true);
                action({ state: true });
            };

            // Off based on Run_period
            if (config.run_period) {
                setTimeout(() => {
                    if (config.pin) {
                        gpio.writeGpio(config, false);
                        action({ state: false });
                    };
                }, config.run_period * 60000);
            };
        };


        // Clock Action
        this.clock = (config, job, action) => {
            let switcher = job.action === 'on' ? true : false;

            // Gpio switcher 
            if (job.action === 'on' || job.action === 'off') {
                gpio.writeGpio(config, switcher);
            };

            // Set pwm intensity (brigtness)
            if (job.action === 'dim') {
                gpio.initializeGpio(config, true);
                gpio.initializePwm(config);
                gpio.writePwm(config, job.level);
            };
            action({ state: switcher});
        };
    };
};

module.exports = new Controller;