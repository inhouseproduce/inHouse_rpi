const CronJob = require('cron').CronJob;
const timer = require('./timer');

class Scheduler {
    constructor(){
        this.interval = (config, action) => {
            new CronJob( timer(config), () => { 
				// Turn on based on time_interval
				action.on();

				// Turn off based on run_period
				setTimeout(() => { action.off() }, config.run_period * 60000);
			}).start();
        }
    }
};

module.exports = new Scheduler;