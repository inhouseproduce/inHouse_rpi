const store = require('../../store');
const db = require('../mongodb/modules');
const os = require('os');
var osUtil = require('os-utils');

class Logger {
    constructor() {
        this.engine = (key, data) => {
            this.saveToStore('engine', key, data);
            this.systemCPU();
            this.systemMemory();
        };

        this.modules = (key, list) => {
            let active = 0, inactive = 0;

            let listObj = {
                espLength: list.length,
                active, inactive
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

    systemCPU = () => {
        osUtil.cpuUsage(cpu => {
            this.saveToStore('system', 'cpu', {
                used: cpu
            });
        });
        osUtil.cpuFree(cpu => {
            this.saveToStore('system', 'cpu', {
                free: cpu
            });
        });
    };

    systemMemory = () => {
        this.saveToStore('system', 'memory', {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem()
        });
    };

    saveToStore = async (to, key, res) => {
        store.dispatch({ type: 'STATE', to, key, res });// Save to store state
        this.saveToDB(store.getState().state);
    };

    saveToDB = async state => {
        let clientName = process.env.RESIN_DEVICE_NAME_AT_INIT;
        let client = await db.Client.findOne({ name: clientName });
        await db.Record.findOneAndUpdate(
            { id: client._id },
            { record: state }
        );
    };
};

module.exports = new Logger;