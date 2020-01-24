const moment = require('moment');

const request = require('../../request');
const network = require('../../network');
const storage = require('../../storage');

const arp = require('arp-a');
const fs = require('fs');

class Camera {
    constructor() {
        this.initializeEsps = (config, action) => {
            // this.scanEsp(config.esp, list => {
            //     let options = {
            //         scan: true
            //     };
            //     console.log('list', list)

            //     request.requestAll(list, options, data => {
            //         console.log('response', data)
            //         action(data);
            //     });
            // });
        };

        this.captureImage = (config, action) => {
            this.scanEsp(config.esp, list => {
                let options = {
                    capture: true,
                    sleep: config.time_interval
                };
                console.log('list', list )
                request.requestAll(list, options, data => {
                    console.log('image captured', data)
                    action(data);
                    data.map(item => {
                        let time = `${moment().hour()}:${moment().minute()}`
                        let name = `${time}__${item.position}`;
                        storage.saveImage(item.response, name);
                        console.log('image has been saved')
                        console.log('alive', item.response)
                    });
                });
            });
        };
    };

    scanEsp = async (espList, register) => {
        network.setNetworkList();

        network.readFile((data) => {
            data = data.substring(0, data.length - 1);
            let list = JSON.parse(`{${data}}`);

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