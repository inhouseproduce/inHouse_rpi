const moment = require('moment');

const request = require('../../utility/request');
const network = require('../../utility/network');
const storage = require('../../utility/storage');

class Camera {
    constructor() {
        this.start = (config, scheduleJob) => {
            this.scanEsp(config.esp, list => {
                // Send request to all esps with scan options
                request.requestAll(list, { scan: true }, () => {
                    //
                });

                // Schedule job function
                scheduleJob(this.captureImage);
            });
        };

        this.captureImage = config => {
            this.scanEsp(config.esp, list => {
                let options = {
                    capture: true,
                    sleep: config.time_interval
                };
                
                request.requestAll(list, options, data => {
                    data.map(esp => {
                        this.saveImage(esp);
                    });
                });
            });
        };
    };

    saveImage = esp => {
        // Current time
        let time = `${moment().hour()}:${moment().minute()}`;

        // Image file name -> time + camera position
        let name = `${time}__${esp.position}`;

        // Save image in storage
        storage.saveImage(esp.response, name);
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