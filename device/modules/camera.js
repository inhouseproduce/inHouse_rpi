const moment = require('moment');

const request = require('../../utility/request');
const network = require('../../utility/network');
const storage = require('../../utility/storage');
const gpio = require('../../utility/gpio');

class Camera {
    constructor() {
        this.start = (config, scheduleJob) => {
            console.log('gpio initialize --->')
            // Scan network list and match ip addresses
            this.scanEsp(config.esp, list => {
                // Send request to all esps with scan options
                request.requestAll(list, { scan: true }, () => {
                    // Schedule job function
                    scheduleJob(this.captureImage, list);
                    console.log('off initialize --->')
                });
            });
        };

        this.captureImage = (config, callback) => {
            console.log('gpio off --->')

            this.scanEsp(config.esp, list => {
                // Send response to all esps on the network
                request.requestAll(list, { capture: true }, response => {
                    // Map response to image data
                    let result = response.map(esp => {
                        return this.saveImage(esp);
                    });

                    // Parse async data and callback arr
                    Promise.all(result).then(saved => {
                        callback(list, saved);
                        console.log('gpio off --->')
                    });
                });
            });
        };
    };

    saveImage = async esp => {
        // Current time
        let time = `${moment().hour()}:${moment().minute()}`;

        // Image file name -> time + camera position
        let name = `${time}__${esp.position}`;

        // Save image in storage
        return await storage.saveImage(esp.response, name);
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
};

module.exports = new Camera;