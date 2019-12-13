const gpio = require('../helpers/gpio');

class Switchers {
    constructor() {
        // Interval Action
        this.intervalSwitcher = (config, action) => {
            if (action.on && action.off) {
                action.on();
            }

            if (config.pin) {
                gpio.writeGpio(config, true);
            }

            // Off based on Run_period
            setTimeout(() => {
                if (action.on && action.off) {
                    action.off();
                }

                if (config.pin) {
                    gpio.writeGpio(config, false);
                }
            }, config.run_period * 60000);
        };

        // Clock Action
        this.clockSwitcher = (config, action, job) => {
            // Action switcher
            if (action.on && action.off) {
                action[job.action]();
            };

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

module.exports = new Switchers;