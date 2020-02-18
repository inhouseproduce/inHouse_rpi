const store = require('../../store');

class Logger {
    constructor() {
        this.engine = (key, res) => {
            store.dispatch({
                type: 'STATE',
                key: key,
                res: res
            });
        };
    };
};

module.exports = new Logger;