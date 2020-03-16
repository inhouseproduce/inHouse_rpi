const engine = require('./engine');
const modules = require('./modules');
const sensors = require('./sensors');
const store = require('../store');

class Device {
    constructor() {
        this.start = async (sysOp, callback) => {
            await Object.keys(sysOp.config).map(key => {
                let config = sysOp.config[key];
                let runAction = this[key];

                if (runAction) {
                    runAction(config, job => {
                        store.dispatch({
                            type: 'CURRENT_JOB',
                            schedule: job
                        });
                    });
                }
            });
            if (callback) callback();
            return
        };

        this.stop = callback => {
            // Jobs objct in store
            let jobs = store.getState().jobs;

            // Stop All jobs. 
            Object.keys(jobs).map(each => {
                jobs[each].map(job => {
                    job.stop();
                });
            });

            store.dispatch({
                type: 'CURRENT_JOB',
                schedule: {}
            });

            if (callback) callback();
            return
        };
    };

    sensors = async (config, cb) => {
        sensors.start(config, jobs => {
            cb(jobs);
        });
    };

    engine = async (config, cb) => {
        engine.start(config, jobs => {
            cb(jobs);
        });
    };

    modules = async (config, cb) => {
        modules.start(config, jobs => {
            cb(jobs);
        });
    };
};

module.exports = new Device;