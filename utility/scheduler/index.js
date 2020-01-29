const CronJob = require('cron').CronJob;

class Scheduler {
    constructor() {
        this.interval = (config, option, action) => {
            // option.int if to run initially
            if (option && option.int)
                action();

            // Time interval Cron in format
            let interval_timer = `0 */${config.time_interval} * * * *`;

            // Create cron job
            let cron = new CronJob(interval_timer, () => {
                action();
            });

            // Start cron job and return 
            cron.start();
            return cron;
        };

        this.clock = (config, option, action) => {
            let nextDates = config.actions.map(job => {
                let { hour, minute, second } = this.timeFormat(job.time);
                let clock_timer = `${second} ${minute} ${hour} * * *`;

                let cronDates = new CronJob(clock_timer, () => {
                    action();
                });
                return { date: cronDates.nextDates(), job: job };
            });
            return nextDates;
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