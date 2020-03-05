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
                // Scan network list and match ip addresses
                this.scanEsp(config.esp, list => {
                    // Send request to all esps with scan options
                    request.requestAll(list, { scan: true }, () => {
                        scheduleJob(this.captureImage, list); // Schedule job function
                        cameraOff();
                    });
                });
            });
        };

        this.captureImage = (config, callback) => {
            this.camera(config).on((cameraOff) => {
                this.scanEsp(config.esp, async list => {
                    await list.map(async esp => {
                        let image = await this.request(esp, { capture: true });
                        if (image && typeof image === 'string' && image.length > 50) {
                            esp.response = image;
                        } else {
                            esp.response = false
                        }
                    });

                    let imageList = await list.forEach(async esp => {
                        let test = await this.saveImage(esp);
                        console.log('test', test);
                    });

                    Promise.all(imageList).then(resp => {
                        console.log('resp', resp)
                    })


                    // console.log('array', arr);

                    // Promise.all(imageList).then(saved => {
                    //     console.log('saved', saved)
                    //     test()
                    //     cameraOff();
                    //     console.log('promise---->')
                    //     callback(list, saved);
                    // }).catch(err => {
                    //     console.log('promiss all error -->')
                    //     cameraOff();
                    // });

                    // function test(data) {
                    //     console.log('test data -->', data)
                    // }
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

    request = async (esp, command) => {
        try {
            let request = await axios.post(`http://${esp.ip}/`, command);
            return request.data;
        }
        catch (err) { return false };
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