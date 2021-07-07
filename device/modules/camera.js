const moment = require('moment');

const request = require('../../utility/request');
const network = require('../../utility/network');
const storage = require('../../utility/storage');
const mongodb = require('../../utility/mongodb');

class Camera {
    constructor() {
        this.start = (config, scheduleJob) => {
            network.setNetworkList(() => {
                // Scan network list and match ip addresses
                this.scanEsp(config.esp, list => {
                    // Send request to all esps with scan options
                    request.requestAll(list, { scan: true }, () => {
                        // Schedule job function
                        scheduleJob(this.captureImage, list);
                    });
                });
            });
        };

        this.captureImage = (config, callback) => {
            this.scanEsp(config.esp, list => {
                // Specify options for 
                let commands = { capture: true, sleep: config.time_interval };

                // Send response to all esps on the network
                request.requestAll(list, commands, response => {
                    // Map response to image data
                    response.map(esp => {
                        // Save images in S3
                        this.saveImage(esp, info => {
                            mongodb.actions.saveImages(info); // Save image url
                            callback(info); // Callback for logger
                        });
                    });
                });
            });
        };
    };

    saveImage = async (esp, callback) => {
        // Current time
        let time = `${moment().hour()}:${moment().minute()}`;

        // Image file name -> time + camera position
        let name = `${time}__${esp.position}`;

        // Save image in storage
        storage.saveImage(esp.response, name, info => {
            callback(info);
        });
    };

    scanEsp = async (espList, register) => {
        network.readFile((list) => {
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