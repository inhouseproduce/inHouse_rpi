const CronJob = require('cron').CronJob;
const state = require('./state');

class Scheduler {
    constructor() {
        this.interval = (config, option, action) => {
            // option.int if to run initially
            if (option && option.int)
                action();

            // Time interval Cron in format
            let interval = config.time_interval;
            let interval_timer = `0 */${interval} * * * *`;

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
                // Convert Job time to cron format
                let { hour, minute, second } = this.timeFormat(job.time);
                let clock_timer = `${second} ${minute} ${hour} * * *`;

                // Scedule job
                let cron = new CronJob(clock_timer, () => {
                    action();
                });

                // Return next date and current job
                return { date: cron.nextDates(), job: job };
            });

            state.catch(nextDates, job => {
                action(action, job);
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