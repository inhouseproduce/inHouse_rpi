const config = require('./config.json');
const scheduler = require('./scheduler');

var gpio = require('gpio');

let { pump, lighting } = config;

var gpio4 = gpio.export(18, {
    direction: gpio.DIRECTION.OUT,
 });

// Pump action
scheduler[pump.type](config.pump, {
    on: () => {
        console.log('pump is on ')
        gpio4.set(1);
    },
        
    off: () => {
        console.log('pump is off ')
        gpio4.set(0);
    }
});