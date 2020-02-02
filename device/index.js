const logger = require('../utility/logger');
const store = require('../store');

const engine = require('./engine');
const modules = require('./modules');

class Device {
    constructor() {
        this.start = sysOp => {
            Object.keys(sysOp.config).map(opp => {
                let action = this[opp];
                let config = sysOp.config[opp];

                action(config, data => {
                    store.dispatch({
                        type: 'CURRENT_JOB',
                        schedule: data
                    });
                });
            });
        };
    };

    engine = async (config, cronJobs) => {
        engine.start(config, jobs => {
            cronJobs(jobs);
        });
    };

    modules = async (config, cronJobs) => {
        modules.start(config, jobs => {
            cronJobs(jobs);
        });
    };
};

module.exports = new Device;