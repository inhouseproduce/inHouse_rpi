const gpio = require('../../utility/gpio');

class Static {
    constructor() {
        this.start = (config) => {
            console.log('config.pin', config.pins);
            config.pins.map(pin => {
                gpio.initializeGpio(pin, true);
                gpio.writeGpio(pin, true);
            });
        };
    };
};

module.exports = new Static;