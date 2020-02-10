const logger = require('../utility/logger');
const store = require('../store');

const engine = require('./engine');
const modules = require('./modules');

let { CURRENT_JOB } = require('../store/actionTypes');

class Device {
    constructor() {
        this.start = sysOp => {
            Object.keys(sysOp.config).map(opp => {
                let config = sysOp.config[opp];
                let runAction = this[opp];

                runAction(config, data => {
                    store.dispatch({
                        type: CURRENT_JOB,
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