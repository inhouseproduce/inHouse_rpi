const gpio = require('../../utility/gpio/gpio');

class Controller {
    constructor() {
        // Interval Action
        this.interval = (config) => {
            if (config.pin)
                gpio.writeGpio(config, true);

            // Off based on Run_period
            setTimeout(() => {
                if (config.pin)
                    gpio.writeGpio(config, false);
            },
                config.run_period * 60000);
        };


        // Clock Action
        this.clock = (config, action, job) => {
            console.log(job.action);

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