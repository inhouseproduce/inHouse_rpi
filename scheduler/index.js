
const GPIO = require('gpio');
const CronJob = require('cron').CronJob;

const timer = require('./timer');

class Scheduler {
    constructor(){
        // Interval based scheduling
        this.interval = (config, action) => {
            console.log('code is ready')
            new CronJob(`0 */2 * * * *`, () => {
                // Initialize pin config
                let gpio = GPIO.export(22, {
                    direction: GPIO.DIRECTION[config.direction],
                });
                gpio.set()
                // Switch pin on/off
                // this.actionSwitch(config, action, gpio);
			}).start();
        }

        this.clock = () => {
            let gpio = this.initializeGpio(config);
            setInterval(() => {
                this.actionSwitch(config, action, gpio);
            }, 1000);

        }
    }

    actionSwitch( config, action, gpio ){
        onoff(true);
        setTimeout(() => { onoff(false) },
            config.run_period * 60000);
        
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