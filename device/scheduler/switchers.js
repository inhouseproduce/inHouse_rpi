const GPIO = require('rpio');

class Switchers {
    constructor() {
        // Interval Action
        this.intervalSwitcher = (config, action) => {
            if (action.on && action.off) {
                action.on();
            }

            if (config.pin) {
                GPIO.write(config.pin, GPIO.LOW);
            }

            // Off based on Run_period
            setTimeout(() => {
                if (action.on && action.off) {
                    action.off();
                }

                if (config.pin) {
                    GPIO.write(config.pin, GPIO.HIGH);
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
                GPIO.write(config.pin, GPIO[(
                    job.action === 'on' ? 'LOW' : 'HIGH'
                )]);
            };

            // Set pwm intensity (brigtness)
            if (job.action === 'dim') {
                this.initializeGpio(config, job);
            };
        };
    };

    initializeGpio = (config, job) => {
        // Open PWM
        GPIO.open(config.pwm, GPIO.PWM)
        // Set ~Hz
        GPIO.pwmSetClockDivider(256);
        // Set range 100%
        GPIO.pwmSetRange(config.pwm, 100);
        // Set PWM/brightness
        let brightness = Number(job.level) || 100;
        GPIO.pwmSetData(config.pwm, brightness);
    };

    initializeGpio = (config, int) => {
        let initialState = GPIO[int ? 'HIGH' : 'LOW'];
        let direction = GPIO[config.direction];
        let pin = config.pin;
        GPIO.open(pin, direction, initialState);
    };

    writeGpio = () => {

    };
};

module.exports = new Switchers;