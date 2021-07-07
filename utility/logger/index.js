const store = require('../../store');

class Logger {
    constructor() {
        this.engine = (key, data) => {
            this.saveToStore('engine', key, data);
        };

        this.modules = (key, list) => {
            let active = 0, inactive = 0;

            let listObj = {
                espLength: list.length
            };

            list.map(esp => {
                if (esp.active) {
                    active++;
                    listObj.active = { [esp.mac]: { position: esp.position }, length: active };
                }
                else {
                    inactive++;
                    listObj.inactive = { [esp.mac]: { position: esp.position }, length: inactive };
                };
            });
            this.saveToStore('module', key, listObj);
        };
    };

    saveToStore = (to, key, res) => {
        store.dispatch({ type: 'STATE', to, key, res });// Save to store state
    };
};

module.exports = new Logger;