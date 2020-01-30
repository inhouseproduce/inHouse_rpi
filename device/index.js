const logger = require('../utility/logger');

const engine = require('./engine');
const modules = require('./modules');

class Device {
    constructor(dev) {
        let { store, sysOp } = dev;

        this.start = () => {
            Object.keys(sysOp.config).map(opp => {
                // Select action from this (current class)
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

module.exports = Device;