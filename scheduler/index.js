
const CronJob = require('cron').CronJob;
var GPIO = require('rpio');

class Scheduler {
    constructor(){
        this.interval = (config, action) => {
            // Initialize Gpio, Initially off by default
            GPIO.open(config.pin, GPIO[config.direction], GPIO.HIGH);

            // Run cron based on time_interval
            new CronJob(`0 */${config.time_interval} * * * *`, () => {
                // Switch to on, on every run
                if( action.on && action.off )
                    action.on();
                if( config.pin )
                    GPIO.write(config.pin, GPIO.LOW);

                // Off based on Run_period
                setTimeout(() => {
                    if( action.on && action.off )
                        action.off();
                    if( config.pin )
                        GPIO.write(config.pin, GPIO.HIGH);
                }, config.run_period * 60000);
			}).start();
        };

        this.clock = (config, action) => {
            GPIO.open(config.pwm, GPIO.PWM)
            GPIO.pwmSetClockDivider(128);
            GPIO.pwmSetRange(config.pwm, 100);// set the range

            config.actions.map( job => {
                let { hour, minute, second } = this.timeParser(job.time);

                new CronJob(`${second} ${minute} ${hour} * * *`, () => {
                    GPIO.pwmSetData(config.pwm, 50);
                }).start();
            });
        };
    };

    timeParser( data ){
        let time = data.split(':');
        return {
            hour: time[0],
            minute: time[1] ? time[1] : '00',
            second: time[2] ? time[2] : '00'
        };
    };
};

module.exports = new Scheduler;