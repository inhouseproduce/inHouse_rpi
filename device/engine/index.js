const scheduler = require('../../utility/scheduler');

const controller = require('./engine');

class Engine {
    constructor() {
        this.start = (data, action) => {
            let jobList = {};

            Object.keys(data).map(opp => {
                let config = data[opp];

                // Initialize Gpio pins based on config
                controller.initialize(config);

                // Get scheduler type based on config
                let schedule = scheduler[config.type];
                let engineAction = controller[config.type];

                // Schedule a job based on config type
                let cronJobs = schedule(config, { int: true }, (action, job) => {
                    engineAction(config, action, job);
                });

                // Jet jobs to jobList object
                cronJobs.map(job => { jobList[opp] = job });
            });
            
            // Return created cron jobs
            action(jobList);
        };
    };
};

module.exports = new Engine;