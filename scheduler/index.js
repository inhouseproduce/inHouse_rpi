
const CronJob = require('cron').CronJob;
var GPIO = require('rpio');

class Scheduler {
    constructor(){
        this.interval = (config, action) => {
            let { pin, direction, time_interval, run_period } = config;

            // Initialize Gpio, Initially off by default
            GPIO.open(pin, GPIO[direction], GPIO.LOW);

            // Run cron based on time_interval
            new CronJob(`0 */${time_interval} * * * *`, () => {
                // Initially on
                onoff( true );
                // Off based on Run_period
                setTimeout(() => 
                    onoff( false ), run_period * 60000);

                // ON OFF switch function
                function onoff(switcher){
                    if( action.off && action.on ){
                        action[switcher ? 'on' : 'off']();
                    }
                    if( direction && pin ){
                        GPIO.write(pin, GPIO[!switcher ? 'HIGH' : 'LOW']);
                    }
                };
			}).start();
        };

        this.clock = (config, action) => {
            // Extract data from config
            let { pin, pwm, direction } = config;
            // Initialize Gpio
            // Map actions, create cron job for each schedule index
  
           

            config.actions.map( job => {
                // Parse Date times
                let { hour, minute, second } = this.timeParser(job.time);
                // Run cron based on schedule action 
                GPIO.open(12, GPIO.PWM)
                GPIO.pwmSetClockDivider(16);
                GPIO.pwmSetRange(12, 100);// set the range
                new CronJob(`${second} ${minute} ${hour} * * *`, () => {
                    GPIO.pwmSetData(12, 50); // adjust the brightness
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