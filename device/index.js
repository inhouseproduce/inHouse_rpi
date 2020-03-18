const engine = require('./engine');
const modules = require('./modules');
const sensors = require('./sensors');
const store = require('../store');

class Device {
    constructor() {
        this.start = async (sysOp, callback) => {
            // Loop through config json
            await Object.keys(sysOp.config).map(key => {
                let config = sysOp.config[key]; // specific config dir
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

        this.stop = async callback => {
            // Jobs objct in store
            let jobs = await store.getState().jobs;

            // Stop All jobs. 
            Object.keys(jobs).map(each => { // map jobs in store

                //====== needs to be fixed to all ==== 
                // ========== camera schedule obj is missing =====
                if (each !== 'camera') {
                    jobs[each].map(job => { // map each job
                        job.stop();
                    });
                };
            });

            // Empty store jobs obj
            store.dispatch({
                type: 'CURRENT_JOB',
                schedule: {}
            });

            // If callback make callback
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