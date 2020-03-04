const store = require('../../store');
const db = require('../mongodb/modules');
const os = require('os');
const osUtil = require('os-utils');
const actionDB = require('../mongodb/actions');

class Logger {
    constructor() {
        this.engine = (key, data) => {
            this.saveToStore('engine', key, data);

            osUtil.cpuUsage(cpu => {
                this.saveToStore('system', 'cpu', {
                    used: Math.round(cpu) * 100
                });
            });

            this.saveToStore('system', 'memory', {
                used: Math.round((os.totalmem() - os.freemem()) / os.totalmem())
            });
        };

        this.modules = (key, modules, result) => {
            if (modules) {
                let res = this.moduleList(modules);
                this.saveToStore('module', key, res);
            };
            if (result) {
                let res = this.resultList(result);
                console.log('res---->', res)
                this.saveImages(res);
            };
        };
    };

    saveImages = async data => {
        try {
            // Client info
            let client = await actionDB.findClient();

            // Save images in mongodb /records
            await actionDB.saveImages(client.id, data);

        } catch (error) { throw error; return false };
    };

    resultList = list => {
        return list.map(item => {
            if (item) {
                return {
                    name: item.Key,
                    image: item.Location,
                    createdAt: Date.now(),
                }
            };
        });
    };

    moduleList = list => {
        let active = 0, inactive = 0;

        let listObj = {
            espLength: list.length,
            active, inactive,
        };

        list.map(esp => {
            if (esp.active) {
                active++;
                listObj.active = active;
            }
            else {
                inactive++;
                listObj.inactive = inactive;
            };
        });
        return listObj;
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