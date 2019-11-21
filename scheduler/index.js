
const GPIO = require('gpio');
const CronJob = require('cron').CronJob;

const timer = require('./timer');
const checker = require('../errorlog');

class Scheduler {
    constructor(){
        this.interval = (config, action) => {
            // Initialize pin config
            let gpio = GPIO.export(config.pin, {
                direction: GPIO.DIRECTION[config.direction],
            });

            // Turn on on the start
            if( config.int ) 
                this.action(config, action, gpio);

            // If config requires error checker
            if( config.errorCheck ) 
                checker.error(config, gpio);
            
            // Run interval specified in config
            new CronJob( timer(config), () => { 
                this.action(config, action, gpio);
			}).start();
        }
    }

    action(config, action, gpio){
        // Tun on int cron timer
        action.on();
        gpio.set(1);

        // Turn off in run_period * miliseconds
        setTimeout(() => { 
            action.off();
            gpio.set(0)
         }, config.run_period * 60000);
    }
};

module.exports = new Scheduler;