const logger = require('../utility/logger');

const engine = require('./engine');
const modules = require('./modules');

const store = require('../store/create');

class Device {
    constructor(dev) {
        let { sysOp } = dev;

        this.start = () => {
            Object.keys(sysOp.config).map(opp => {
                // Select action from this (current class)
                let action = this[opp];
                let config = sysOp.config[opp];

                let task = action(config, store);
                console.log('task', task)
                // Store jobs in redux
                store().dispatch({
                    type: 'CURRENT_JOB',
                    schedule: {
                        [opp]: task
                    }
                });
            })
        };
    };

    engine = config => {
        return engine.start(config, data => {
            logger.action(data);
        });
    };

    modules = config => {
        return modules.start(config, data => {
            logger.action(data);
        });
    };
};

module.exports = Device;