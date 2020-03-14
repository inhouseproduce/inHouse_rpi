const axios = require('axios');
const moduleSwitch = require('../module');
const network = require('../../../../utility/network');

class Request {
    constructor() {
        this.sendCommand = async (config, command, callback) => {
            moduleSwitch.on(config, cameraOff => {
                network.matchEsp(config.esp, async list => {
                    this.requestAll(list, config, command, response => {
                        callback(response, list);
                        cameraOff();
                    });
                });
            });
        };
    };

    failedRequest = async (result, config, command, callback) => {
        let arr = [], recived = 0, failed = 0;
        await result.map(item => {
            if (!item.response || !item.response === 'string') {
                failed++;
                arr.push(item);
                console.log('failed item', item)
            }
            else {
                recived++;
            };
        });

        result.map(item => {
            console.log('==========')
            console.log('string', typeof item.response)
            console.log('length', item.response.length);
            console.log('==========')
        });

        if (arr.length) {
            moduleSwitch.restart(config, (cameraOff) => {
                this.request(arr, command, response => {
                    this.parseData(response, parsed => {
                        var data = result.concat(parsed);
                        cameraOff();
                        callback(result);
                    });
                });
            });
        } else {
            callback(result)
        };

        console.log('failed', failed);
        console.log('recived', recived);
    };

    requestAll = async (esps, config, command, callback) => {
        // Clone array to emutate
        let list = esps.slice();
        let timeout = true;

        await this.request(list, command, async response => {
            this.parseData(response, result => {
                this.failedRequest(result, config, command, readyList => {
                    callback(readyList);
                    timeout = false;
                });
            });

            setTimeout(() => {
                if (timeout) {
                    console.log('timeOut')
                    this.failedRequest(list, config, command, (readyList) => {
                        callback(readyList);
                    });
                };
            }, 50000);
        });
    };

    request = async (list, command, callback) => {
        // Request to all esps
        let data = await list.map(async esp => {
            return await request(esp)
        });

        callback(data);

        // Make request
        async function request(esp) {
            try {
                let res = await axios.post(`http://${esp.ip}/`, command);
                if (res.data) {
                    esp.response = res.data;
                    return esp;
                }
                else {
                    return handleError(esp);
                };
            }
            catch (err) {
                return handleError(esp);
            };
        };
        // Handle error
        function handleError(espData) {
            espData.response = false;
            return espData;
        };
    };

    parseData = (data, callback) => {
        Promise.all(data).then(res => {
            callback(res);
            return
        }).catch(err => { callback(false); return });
    };
};

module.exports = new Request;