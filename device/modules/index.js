const scheduler = require('../../utility/scheduler');
const camera = require('./camera');

class Modules {
    constructor() {
        this.start = (config, action) => {
            Object.keys(config).map(async opp => {
                // this.moduleAction
                let moduleAction = this[opp];

                moduleAction(config[opp], job => {
                    // Config type
                    let type = config[opp].type;

                    // Run Scheduler based on config type
                    let schedule = scheduler[type];

                    // Scheduler options
                    let option = { int: false };

                    // Schedule job based on callback from moduleAction
                    let cronJobs = schedule(config[opp], option,
                        () => {
                            return job(config[opp]);
                        });

                    // Callback cronJobs to module.start
                    let cronObj = {};

                    cronJobs.map(item => {
                        cronObj[opp] = item;
                    });

                    action(cronObj);
                });
            });
        };
    };

    // Module Action
    camera = (config, job) => {
        return camera.start(config, action => {
            job(action);
        });
    };
};

module.exports = new Modules;