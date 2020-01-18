// Libs
const axios = require('axios');
const networkScan = require('local-devices');

// Storage api
const s3Storage = require('../../s3.storage');

class Esp {
    constructor() {
        this.initializeEsps = (config, options) => {
            this.scanEsp(config.esp, list => {
                this.requestAll(list, options, data => {
                    this.initialize(data);
                });
            });
        };

        this.captureImage = (config, options) => {
            this.scanEsp(config.esp, list => {
                this.requestAll(list, options, data => {
                    this.saveImages(data);
                });
            });
        };
    };

    scanEsp = async (espList, register) => {
        let list = await this.scanNetwork();

        register(espList.map(esp => {
            return match(esp, list[esp.mac]);
        }));

        function match(esp, activeEsp) {
            esp.ip = activeEsp && activeEsp.ip;
            esp.active = activeEsp ? true : false;
            return esp;
        };
    };

    requestAll = async (espList, options, cb) => {
        let list = espList.map(async esp => {
            return await this.request(esp, options);
        });
        Promise.all(list).then(resp => {
            cb(resp);
        });
    };

    request = async (esp, options) => {
        if (esp.active) {
            try {
                let url = `http://${esp.ip}`;
                let resp = await axios.post(url, options);
                return constract(resp.data);
            } 
            catch (error) {
                return constract(false);
            };
            function constract(data) {
                esp.response = data;
                return esp;
            };
        } else { return esp };
    };

    scanNetwork = async count => {
        try {
            let scaned = await networkScan();
            return Object.assign({}, ...scaned.map(net => {
                return { [net.mac]: net };
            }));
        } catch {
            if (count <= 2) this.scanNetwork(count++);
            console.log('network scan failed')
        };
    };

    saveImages = data => {
        console.log('checking', data );
    };

    initialize = data => {
        console.log('data--', data.length);
    };
};

module.exports = new Esp;