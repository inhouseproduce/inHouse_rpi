const scheduler = require('../../utility/scheduler');
const logger = require('../../utility/logger');

const camera = require('./camera');

class Modules {
    constructor() {
        this.start = (config, callback) => {
            Object.keys(config).map(async key => {
                // Gether data
                let { schedule, option } = collectData();

                // select specific function from this (this.camera/sensors)
                let moduleAction = this[key];

                moduleAction(config[key], (job, list) => {
                    // Record Scaned esp list
                    logger.modules(key, list);

                    // Schedule job based on callback from moduleAction
                    let cronJobs = schedule(config[key], option,
                    () => {
                        return job(config[key], (modules, result) => {
                            logger.modules(key, modules, result);
                        });
                    });

                    // Callback cron jobs list
                    callback(readyCronJobs(cronJobs));
                });

                function readyCronJobs(cronJobs) {
                    // Callback cronJobs for module.start
                    let cronObj = {};

                    // set cron data
                    cronJobs.map(item => {
                        cronObj[key] = item;
                    });
                    return cronObj;
                };

                function collectData() {
                    // Config type
                    let type = config[key].type;
                    // Run Scheduler based on config type
                    let schedule = scheduler[type];
                    // Scheduler options
                    let option = { int: false };

                    return { schedule, option }
                };;
            });
        };
    };

    // Module Action
    camera = (config, action) => {
        camera.start(config, (job, list) => {
            action(job, list);
        });
    };
};

module.exports = new Modules;