const engine = require('./engine');
const modules = require('./modules');

const store = require('../store');

let { CURRENT_JOB } = require('../store/actionTypes');

class Device {
    constructor() {
        this.start = sysOp => {
            Object.keys(sysOp.config).map(key => {
                let config = sysOp.config[key];
                let runAction = this[key];

                runAction(config, job => {
                    store.dispatch({
                        type: CURRENT_JOB,
                        schedule: job
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