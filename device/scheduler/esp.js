// Libs
const axios = require('axios');
const networkScan = require('local-devices');

// Storage api
const s3Storage = require('../../s3.storage');

class Esp {
    constructor() {
        this.initializeEsps = (config, options) => {
            this.registerEsp(config.esp, list => {
                this.requestAll(list, options, data => {
                    console.log('data', data)
                    //this.getListInfo(list, data);
                });
            });
        };

        this.captureImage = (config, options) => {
            this.scanEspList(config.esp, options, list => {
                config.esp.map(esp => {
                    s3Storage.saveImage(list[esp.ip]);
                });
            });
        };
    };

    registerEsp = async (espList, register) => {
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

    requestAll = (espList, options, cb) => {
        let list = espList.map(async esp => {
            if(esp.active){
                try {
                    let resp = await axios.post(`http://${esp.ip}`, options);
                    esp.response = resp.data;
                    return esp;
                } catch (error) {
                    esp.response = false;
                    return esp;
                };
            } else { return esp };
        });
        Promise.all(list).then(resp => {
            console.log('response', resp)
            cb(resp);
        });
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
};

module.exports = new Esp;