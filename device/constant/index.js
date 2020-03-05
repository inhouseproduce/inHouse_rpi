const GPIO = require('rpio');

class constant {
    constructor() {
        this.start = (config) => {
            console.log('config.pin', config.pins);
            config.pins.map(pin => {
                GPIO.open(pin, GPIO.OUTPUT, GPIO['HIGH']);
                GPIO.write(pin, GPIO['HIGH']);
            });
        };
    };
};

module.exports = new constant;