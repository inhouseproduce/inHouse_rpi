const GPIO = require('rpio');

// Initial gpio option
GPIO.init({ gpiomem: false });

class GpioActions {
    constructor() {
        // Gpio Initializeation
        this.initializeGpio = (config, init) => {
            if (config.pin && config.direction) {
                // LOW is on High is off
                let initialState = GPIO[init ? 'HIGH' : 'HIGH'];
                let direction = GPIO[config.direction];
                let pin = config.pin;
                GPIO.open(pin, direction, initialState);
            };
        };

        // Pwm Initializeation
        this.initializePwm = (config) => {
            if (config.pin && config.pwm) {
                GPIO.open(config.pin, GPIO[config.direction], GPIO.HIGH);
                // Open PWM
                GPIO.open(config.pwm, GPIO.PWM)
                // Set ~Hz
                GPIO.pwmSetClockDivider(256);
                // Set range 100%
                GPIO.pwmSetRange(config.pwm, 100);
                // Set PWM/brightness initially 100%
                GPIO.pwmSetData(config.pwm, 100);
            };
        };

        // Write gpio
        this.writeGpio = (config, init) => {
            if (config.pin) {
                GPIO.write(config.pin, GPIO[init ? 'HIGH' : 'LOW']);
                // initialize at 100% - if pwm;
                if (config.pwm) {
                    GPIO.pwmSetData(config.pwm, 100);
                };
            };
        };

        // Write pwm / set brightness
        this.writePwm = (config, level) => {
            if (config.pwm) {
                let brightness = Number(level);
                GPIO.pwmSetData(config.pwm, brightness);
            };
        };
    };
};

module.exports = new GpioActions;