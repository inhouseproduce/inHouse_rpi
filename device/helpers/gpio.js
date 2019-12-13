const GPIO = require('rpio');

// Initial gpio option
GPIO.init({ gpiomem: false });

class GpioActions {
    constructor() {
        // Initializeation
        this.initializeGpio = (config, init) => {
            // LOW is on High is off
            let initialState = GPIO[init ? 'LOW' : 'LOW'];
            let direction = GPIO[config.direction];
            let pin = config.pin;
            GPIO.open(pin, direction, initialState);
        };

        // Initializeation
        this.initializePwm = (config) => {
            GPIO.open(config.pin, GPIO[config.direction], GPIO.LOW);
            // Open PWM
            GPIO.open(config.pwm, GPIO.PWM)
            // Set ~Hz
            GPIO.pwmSetClockDivider(256);
            // Set range 100%
            GPIO.pwmSetRange(config.pwm, 100);
            // Set PWM/brightness initially 100%
            GPIO.pwmSetData(config.pwm, 100);

        };

        // Write gpio
        this.writeGpio = (config, init) => {
            if (config.pin) {
                GPIO.write(config.pin, GPIO[init ? 'LOW' : 'HIGH']);
                // If config has pwm than initialize 100;
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