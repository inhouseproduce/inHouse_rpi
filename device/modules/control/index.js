const gpio = require('../../../utility/gpio');
const axios = require("axios");

const network = require("../../../utility/network");

class ModuleControl {
    constructor() {
        this.sendCommand = async (config, command, callback) => {
            this.module.on(config, (cameraOff) => {
                this.scanEsp(config.esp, async list => {
                    this.request(list, command, response => {
                        callback(response, list);
                        cameraOff();
                    });
                });
            });
        };

        this.handleResponse = async (res, config, callback) => {
            let data = await formatArr(res);

            console.log('response', res)
            console.log('data', data);

            async function formatArr(resp) {
                let arr = [];
                await resp.map(item => {
                    if (item && !item.response) arr.push(item);
                });
                return arr;
            };
        };

        this.module = {
            init: (config, callback) => {
                gpio.initializeGpio(config, false);
                gpio.writeGpio(config, true);
                this.deleay(() => {
                    if (callback)
                        callback(() => this.module.off(config));
                    else return;
                });
                console.log('camera initialize')
            },
            on: (config, callback) => {
                gpio.writeGpio(config, true);
                this.deleay(() => {
                    if (callback)
                        callback(() => this.module.off(config));
                    else return;
                });
                console.log('camera ON')
            },
            off: (config, callback) => {
                gpio.writeGpio(config, false);
                this.deleay(() => {
                    if (callback) callback();
                    else return;
                });
                console.log('camera OFF')
            }
        };
    };

    request = async (esps, command, callback) => {
        // Clone array to emutate
        let list = esps.slice();

        // Request to all esps
        let data = await list.map(async esp => {
            let res = await axios.post(`http://${esp.ip}/`, command);

            if (res.data) {
                esp.response = res.data;
                return list;
            } else {
                esp.response = false;
                return list;
            };
        });

        Promise.all(data).then(testing => {
            console.log('testing', testing)
        });

        async function send(ip, cb) {
            try {
                let req = await axios.post(`http://${ip}/`, command);
                return cb(req);
            } catch (err) { cb(false) };
        };
    };

    scanEsp = async (espList, register) => {
        network.networkList(list => {
            if (list) {
                // Map esp list, match with ip on the network
                let camera_esp = espList.map(esp => {
                    return match(esp, list[esp.mac]);
                });

                register(camera_esp);

                function match(esp, activeEsp) {
                    esp.ip = activeEsp && activeEsp.ip;
                    esp.active = activeEsp ? true : false;
                    return esp;
                };
            };
        });
    };

    parseData = (data, callback) => {
        Promise.all(data).then(res => {
            callback(res);
        }).catch(err => { callback(false) });
    };

    deleay = (cb) => { setTimeout(() => { cb() }, 1000) };
};

module.exports = new ModuleControl;
