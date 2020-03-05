const engine = require('./engine');
const modules = require('./modules');
const sensors = require('./sensors');
const store = require('../store');
const constant = require('./constant');

class Device {
    constructor() {
        this.start = sysOp => {
            Object.keys(sysOp.config).map(key => {
                console.log('key', key)
                let config = sysOp.config[key];
                let runAction = this[key];

                runAction(config, job => {
                    store.dispatch({
                        type: 'CURRENT_JOB',
                        schedule: job
                    });
                });
            });
        };
    };

    constant = async (config, cb) => {
        constant.start(config);
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