const CronJob = require('cron').CronJob;

class Scheduler {
    constructor() {
        this.interval = (config, option, action) => {
            // option.int if to run initially
            if(option && option.int)
                action();

            // Cron function to schedule action (passed as arg)
            let interval_timer = `0 */${config.time_interval} * * * *`;
            let cron = new CronJob(interval_timer, () => {
                action();
            });

            // Run cron and return schedule
            cron.start();
            return cron;
        };

        this.clock = (job, action) => {
            // Extract time values
            let { hour, minute, second } = this.timeFormat(job.time);

            // Run cron schedule based on job argument
            let cron = new CronJob(`${second} ${minute} ${hour} * * *`, () => {
                action();
            });

            cron.start();
            return cron;
        };
    };

    timeFormat(data) {
        let time = data.split(':');
        return {
            hour: time[0],
            minute: time[1] ? time[1] : '00',
            second: time[2] ? time[2] : '00'
        };
    };
};

module.exports = new Scheduler;