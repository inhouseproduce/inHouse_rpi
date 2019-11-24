
const GPIO = require('gpio');
const CronJob = require('cron').CronJob;

const timer = require('./timer');

class Scheduler {
    constructor(){
        this.interval = (config, action) => {
            new CronJob(`0 */${config.time_interval+1} * * * *`, () => {
                // Gpio configuration
                let gpio = GPIO.export(config.pin, {
                    direction: GPIO.DIRECTION[config.direction],
                    ready: () => {
                        // Swtich on/off the action
                        this.intervalAction( config, action, gpio );
                    }
                });
			}).start();
        };

        this.clock = (config, action) => {
            let gpio = GPIO.export(18, {
                direction: GPIO.DIRECTION[config.direction],
                ready: () => {
                    this.clockAction( config, action, gpio );
                }
            });
        };
    };

    clockAction(config, action, gpio){
        onoffSwitch(); // Initially on

        setInterval(() => // Swtich based on interval
            onoffSwitch(), config.time_interval * 60000);
        
        function onoffSwitch(){
            gpio.set(!gpio.value);
            action[!gpio.value ? 'on' : 'off']();
        }
    }

    intervalAction( config, action, gpio ){
        onoffSwitch(true); // Initially On

        setTimeout(() => // Off on set time
            onoffSwitch(false), config.run_period * 60000);

        function onoffSwitch( onoff ){
            if( config.direction && config.pin ) 
                gpio.set(onoff ? 1 : 0);

            if( action && action.on ) 
                action[onoff ? 'on' : 'off']();
        };
    };
};

module.exports = new Scheduler;