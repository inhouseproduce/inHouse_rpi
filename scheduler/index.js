
const GPIO = require('gpio');
const CronJob = require('cron').CronJob;

const timer = require('./timer');
const error = require('./errorLog');

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
            // Initiallize gpio
            let gpio = GPIO.export(config.pin, {
                direction: GPIO.DIRECTION[config.direction],
            });
            config.actions.map( job => {
                let { hour, minute, second } = this.timeParser(job.time);

                new CronJob(`${second} ${minute} ${hour} * * *`, () => {
                    this.clockAction( action, job, gpio );
                }).start();
            });
        };
    };

    timeParser( data ){
        let time = data.split(':')
        return {
            hour: time[0],
            minute: time[1] ? time[1] : '00',
            second: time[2] ? time[2] : '00'
        }
    };

    clockAction( action, job, gpio ){
        gpio.set(0)
        // let onoff = job.action === 'on' ? 1 : 0;
        // gpio.set( onoff );
        // if ( action.dim ){
        //     // dimming
        // }
    };

    intervalAction( config, action, gpio ){
        onoffSwitch(true); // Initially On

        setTimeout(() => // Off on set time
            onoffSwitch(false), config.run_period * 60000);

        function onoffSwitch( onoff ){
            if( config.errorCheck )
                //error.errorCheck();

            if( config.direction && config.pin ) 
                gpio.set(!onoff ? 1 : 0);

            if( action && action.on ) 
                action[onoff ? 'on' : 'off']();
        };
    };
};

module.exports = new Scheduler;