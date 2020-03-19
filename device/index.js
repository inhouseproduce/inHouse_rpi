
const store = require('../store');
const Components = require('./components');

class Device {
    constructor(logger, sysCon) {
        this.start = async callback => {
            // extract config from system config
            const config = sysCon.config;

            // Initialize components
            let components = new Components(logger, config);

            // Map each component with job callback
            await Object.keys(config).map(item => {
                // Map each component as action function
                const action = components[item];
                // Run each action get back sceduled job obj
                action(job => {
                    this.saveJobToStore(job); // Save job in state
                });
            });

            if (callback) callback(); // Callback sync
            return; //return if async
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
            this.saveJobToStore({});

            // If callback make callback
            if (callback) callback();
            return
        };
    }

    saveJobToStore = job => {
        let saveStore = {
            type: 'CURRENT_JOB',
            schedule: job || {}
        }
        store.dispatch(saveStore);
    }
};

module.exports = Device;