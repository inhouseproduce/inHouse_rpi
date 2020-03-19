const network = require('../../../../../utility/network');

const moduleSwitch = require('../module');
const request = require('./request');

class Request {
    constructor() {
        this.sendCommand = (config, command, callback) => {
            moduleSwitch.on(config, cameraOff => {
                network.matchEsp(config.esp, list => {
                    this.requestAll(list, config, command, response => {
                        this.handleFailed(response, config, command, readyList => {
                            callback(readyList, list);
                            cameraOff();
                        });
                    });
                });
            });
        };
    };

    handleFailed = async (result, config, command, callback) => {
        console.log('---------')

        let failedList = await getFailedList(result);

        this.requestAll(failedList, config, command, async response => {
            let combine = response.concat(result);
            let ready = filterList(combine);

            console.log('updated', ready.length)
            callback(result); // change to filter
        });

        async function filterList(list) {
            let filter = [];
            await list.map(item => {
                if (item.response) {
                    filter.push(item);
                }
            });
            return filter;
        };

        async function getFailedList(list) {
            let arr = [], recived = 0, failed = 0;
            await list.map(item => {
                if (!item.response || !item.response === 'string') {
                    failed++;
                    arr.push(item);
                }
                else {
                    recived++;
                };
            });
            console.log('failed', failed);
            console.log('success', recived);
            return arr;
        };
    };

    requestAll = async (esps, config, command, callback) => {
        let list = esps.slice(); // Clone array to emutate
        let timeout = true;

        // Request to all modules
        await request(list, command, response => {
            this.parseData(response, result => {
                callback(result);
            });
        });
        setTimeout(() => {
            if (timeout) {
                console.log('timeOut')
            };
        }, 50000);
    };

    parseData = (data, callback) => {
        Promise.all(data).then(res => {
            callback(res);
            return
        }).catch(err => { callback(false); return });
    };
};

module.exports = new Request;