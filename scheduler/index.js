
const GPIO = require('gpio');
const CronJob = require('cron').CronJob;

const timer = require('./timer');
const checker = require('./errorLog');

class Scheduler {
    constructor(){
        // Interval based scheduling
        this.interval = (config, action) => {
            // Initialize pin config
            let gpio = GPIO.export(config.pin, {
                direction: GPIO.DIRECTION[config.direction],
            });
            gpio.reset()
            // Run interval specified in config
            new CronJob(`0 */${config.time_interval+1} * * * *`, () => {
                action.on();
                gpio.set();
                setTimeout(() => { 
                    action.off();
                    gpio.set(0)
                }, config.run_period * 60000);
			}).start();
        }

        this.clock = (config, action) => {
            let gpio = this.initializeGpio(config);

            if( config.init )
                this.actionSwitch(config, action, gpio );

            setInterval(() => {
                action.on
            }, config.time_interval+1 * 60000);
        }
    }

    actionSwitch( config, action, gpio ){
        // Turn on the start
        onoff(true);

        // Turn off based on run period
        setTimeout(() => { onoff(false) 
        }, config.run_period * 60000);
        
        function onoff(onoff){
            if( config.direction && config.pin ) 
                gpio.set(onoff ? 1 : 0);

            if( action && action.on ) 
                action[onoff ? 'on' : 'off']();
        }
    }

    initializeGpio( config ){
        let gpio = GPIO.export(config.pin, {
            direction: GPIO.DIRECTION[config.direction],
        });
        return gpio;
    }
};

module.exports = new Scheduler;