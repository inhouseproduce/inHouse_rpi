const request = require('../../request');
const network = require('../../network');

class Camera {
    constructor() {
        this.initializeEsps = (config, action) => {
            this.scanEsp(config.esp, list => {
                request.requestAll(list, { scan: true }, data => {
                    action(data);
                });
            });
        };

        this.captureImage = (config, options) => {
            this.scanEsp(config.esp, list => {
                request.requestAll(list, otpions, data => {
                    this.saveImages(data);
                });
            });
        };
    };

    scanEsp = async (espList, register) => {
        let list = await network.scanNetwork();

        register(espList.map(esp => {
            return match(esp, list[esp.mac]);
        }));

        function match(esp, activeEsp) {
            esp.ip = activeEsp && activeEsp.ip;
            esp.active = activeEsp ? true : false;
            return esp;
        };
    };

    saveImages = data => {
        //console.log('request' );
    };

    initialize = data => {
        //console.log('chekcingin')
    };
};

module.exports = new Camera;