const logger = require('../../utility/logger');
const scheduler = require('../../utility/scheduler');

const controller = require('./engine');


class Engine {
    constructor() {
        this.start = (sysOp, callback) => {
            let jobList = {};

            Object.keys(sysOp).map(opp => {
                let config = sysOp[opp];

                // --> Initialize Gpio pins based on config
                controller.initialize(config, resp => {
                    logger.message(`${opp} - ${resp}`)
                });

                // Get scheduler type based on config
                let schedule = scheduler[config.type];
                let engineAction = controller[config.type];

                // --> Schedule a job based on config type
                let cronJobs = schedule(config, { int: true }, (action, job) => {
                    engineAction(config, job, (mess) => {
                        logger.message(`${opp} - ${mess}`)
                    });
                });

                // --> Jet jobs to jobList object
                cronJobs.map(job => { jobList[opp] = job });
            });

            // Return created cron jobs, delete varible
            callback(jobList);
        };
    };
};

module.exports = new Engine;