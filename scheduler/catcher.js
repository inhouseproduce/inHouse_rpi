const CronJob = require('cron').CronJob;

class Checker {
    constructor(){
        this.state = (config) => {
            console.log('config', config)
        }
    }
};

module.exports = new Checker;