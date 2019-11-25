const CronJob = require('cron').CronJob;

class Checker {
    constructor(){
        this.error = (config, gpio) => {
            console.log('error logger is on');
            let int = 0
            new CronJob('0 */1 * * * *', () => {
                int += 1;
                //this.check(gpio.value);
            }).start();
        };

        this.check = onoff => {
            console.log('pin', onoff);
        }
    }
};

module.exports = new Checker;