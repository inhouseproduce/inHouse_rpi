const engine = require('./engine');

const logger = require('../../utility/logger');
const scheduler = require('../../utility/scheduler');

class Engine {
    constructor() {
        this.start = (sysOp, callback) => {
            let jobList = {};

            Object.keys(sysOp).map(key => {
                let config = sysOp[key];

                // --> Initialize Gpio pins based on config
                engine.initialize(config, res => {
                    logger.engine(key, res);
                });

                // Get scheduler type funcs based on config
                let schedule = scheduler[config.type];
                // Get engine type(interval/clock) funcs
                let engineAction = engine[config.type];

                // --> Schedule a job based on config type
                let cronJobs = schedule(config, { int: true }, (action, job) => {
                    // Run engine (interval/clock) functions based on config
                    engineAction(config, job, res => {
                        logger.engine(key, res);
                    });
                });
                // --> Jet jobs to jobList object
                cronJobs.map(job => { jobList[key] = job });
            });

            // Return created cron jobs, delete varible
            callback(jobList);
        };
    };
};

module.exports = new Engine;