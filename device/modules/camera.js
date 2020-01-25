const moment = require('moment');

const request = require('../../request');
const network = require('../../network');
const storage = require('../../storage');

class Camera {
    constructor() {
        this.initializeEsps = (config, action) => {
            this.scanEsp(config.esp, list => {
                let options = {
                    scan: true
                };
                request.requestAll(list, options, data => {
                    action(data);
                });
            });
        };

        this.captureImage = (config, action) => {
            this.scanEsp(config.esp, list => {
                let options = {
                    capture: true,
                    sleep: config.time_interval
                };
                request.requestAll(list, options, data => {
                    action(data);
                    data.map(item => {
                        let time = `${moment().hour()}:${moment().minute()}`;
                        let name = `${time}__${item.position}`;
                        storage.saveImage(item.response, name);
                        if (item.response) {
                            console.log('----- Image caputred -----')
                        }
                    });
                });
            });
        };
    };

    scanEsp = async (espList, register) => {
        network.readFile((list) => {
            if (list) {
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