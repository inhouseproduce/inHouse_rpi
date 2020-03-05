const moment = require('moment');

const request = require('../../utility/request');
const network = require('../../utility/network');
const storage = require('../../utility/storage');
const GPIO = require('rpio');

class Camera {
    constructor() {
        this.start = (config, scheduleJob) => {
            GPIO.open(config.pin, GPIO.OUTPUT, GPIO['HIGH']);
            GPIO.write(config.pin, GPIO['LOW']);
            console.log("gpio on")

            // Scan network list and match ip addresses
            this.scanEsp(config.esp, list => {
                // Send request to all esps with scan options
                request.requestAll(list, { scan: true }, () => {
                    // Schedule job function
                    scheduleJob(this.captureImage, list);
                    GPIO.write(config.pin, GPIO['HIGH']);
                    console.log('gpo off')
                });
            });
        };

        this.captureImage = (config, callback) => {
            console.log('gpio caputre on')
            GPIO.write(config.pin, GPIO['LOW']);

            this.scanEsp(config.esp, async list => {
                // Send response to all esps on the network
                let test = await request.requestAll(list, { capture: true }, response => {
                    console.log('response', response)
                    // Map response to image data
                    if (response) {
                        let result = response.map(esp => {
                            return this.saveImage(esp);
                        });

                        // Parse async data and callback arr
                        console.log('result', result);
                        if (result) {
                            Promise.all(result).then(saved => {
                                callback(list, saved);
                                GPIO.write(config.pin, GPIO['HIGH']);
                                console.log('gpio caputre off')
                            });
                        };
                    };
                });
                console.log('tesing--->', test)
            });
        };
    };

    camera = config => {
        return {
            on: cb => {
                GPIO.write(config.pin, GPIO['LOW']);
                setTimeout(() => { cb() }, 2200);
            }
        }
    }
    saveImage = async esp => {
        // Current time
        let time = `${moment().hour()}:${moment().minute()}`;

        // Image file name -> time + camera position
        let name = `${time}__${esp.position}`;
        console.log('imp check===------==>>', esp.response)

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