const moment = require('moment');
const axios = require('axios');
const GPIO = require('rpio');

const request = require('../../utility/request');
const network = require('../../utility/network');
const storage = require('../../utility/storage');

class Camera {
    constructor() {
        this.start = (config, scheduleJob) => {
            this.camera(config).init((cameraOff) => {
                this.scanEsp(config.esp, list => {
                    request.requestAll(list, { scan: true }, () => {
                        scheduleJob(this.captureImage, list);
                        cameraOff();
                    });
                });
            });
        };

        this.captureImage = (config, callback) => {
            this.camera(config).on((cameraOff) => {
                this.scanEsp(config.esp, async list => {
                    this.requestAll(list, { capture: true }, saved => {
                        Promise.all(saved).then(async resp => {
                            let test = resp.map(async item => {
                                return await this.saveImage(item);
                            });
                            Promise.all(test).then(async imp => {
                                await imp.map((xx, index) => {
                                    if (!xx) {
                                        imp.concat(0, index)
                                    }
                                });
                                callback(list, imp);
                            });
                            cameraOff();
                        });
                    });
                });
            });
        };
    };

    camera = (config) => {
        function cameraOff() {
            GPIO.write(config.pin, GPIO['HIGH']);
            console.log('camera off -->')
        }
        return {
            init: (cb) => {
                GPIO.open(config.pin, GPIO.OUTPUT, GPIO['HIGH']);
                GPIO.write(config.pin, GPIO['HIGH']);
                setTimeout(() => {
                    GPIO.write(config.pin, GPIO['LOW']);
                    setTimeout(() => {
                        cb(cameraOff);
                        console.log('gpio initialize')
                    }, 5000);
                }, 1000);
            },
            on: (cb) => {
                GPIO.write(config.pin, GPIO['LOW']);
                setTimeout(() => {
                    cb(cameraOff);
                    console.log('camera On')
                }, 500);
            },
        }
    };

    requestAll = async (list, command, callback) => {
        let test = await list.map(async esp => {
            try {
                let image = await axios.post(`http://${esp.ip}/`, command);
                esp.response = image.data;
                return esp;
            }
            catch (err) {
                esp.response = false;
                return esp;
            };
        });
        callback(await test);
    };

    saveImage = async (esp) => {
        let image = esp.response;

        if (image && typeof image === 'string') {
            // Current time
            let time = `${moment().hour()}:${moment().minute()}`;

            // Image file name -> time + camera position
            let name = `${time}__${esp.position}`;

            // Save image in storage
            if (image && typeof image === 'string' && image.length > 100) {
                return await storage.saveImage(image, name);
            }
            return false;
        }
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