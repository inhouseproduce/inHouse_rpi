const gpio = require('../../../../../utility/gpio');

const deleay = cb => {
    setTimeout(() => { cb() }, 1000);
};

// Turns on and off module based on config pin
const moduleSwitch = {
    init: (config, callback) => {
        gpio.initializeGpio(config, false);
        gpio.writeGpio(config, true);
        deleay(() => {
            if (callback)
                callback(() => moduleSwitch.off(config));
            else return;
        });
        console.log('camera initialize')
    },

    on: (config, callback) => {
        gpio.writeGpio(config, true);
        deleay(() => {
            if (callback)
                callback(() => moduleSwitch.off(config));
            else return;
        });
        console.log('camera ON')
    },

    off: (config, callback) => {
        gpio.writeGpio(config, false);
        deleay(() => {
            if (callback) callback();
            else return;
        });
        console.log('camera OFF')
    },

    restart: (config, callback) => {
        gpio.writeGpio(config, false);
        deleay(() => {
            gpio.writeGpio(config, true);
        });
        deleay(() => {
            callback(() => moduleSwitch.off(config));
            console.log('restarted')
        });
    }
};

module.exports = moduleSwitch;