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

                // Store jobs in redux
                store.dispatch({
                    type: 'CURRENT_JOB',
                    schedule: {
                        [opp]: action(config, store)
                    }
                });
            });
        };
    };

    engine = (config, store) => {
        return engine.start(config, data => {
            logger.action(data);
        });
    };

    modules = (config, store) => {
        return modules.start(config, data => {
            logger.action(data);
        });
    };
};

module.exports = Device;