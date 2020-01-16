const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const scanNetwork = require('local-devices');

const s3Storage = require('../../s3.storage');

class Esp {
    constructor() {
        this.initializeEsps = (config, options) => {
            this.scanEspList(config.esp, options, data => {
                this.getListInfo(config.esp, data);
            });
        };

        this.captureImage = (config, options) => {
            this.scanEspList(config.esp, options, data => {
                this.getListInfo(config.esp, data);
                config.esp.map(item => {
                    s3Storage.saveImage(data[item.ip]);
                });
            });
        };
    };

    matchIp = () => {
        let scaned = await scanNetwork();
        let netList = {};

        scaned.map(net => {
            netList[net.mac] = net
        });
    };

    scanEspList = (espList, options, cb) => {
        let list = espList.map(async esp => {
            let resp = await this.request(esp, options);
            return { [esp.ip]: resp };
        });
        Promise.all(list).then(resp => {
            cb(Object.assign({}, ...resp));
        });
    };

    request = async (esp, options) => {
        try {
            let resp = await axios.post(`http://${esp.ip}`, options);
            return (resp || resp.data) ? resp.data : false;
        } catch (error) { return false };
    };

    getListInfo = (espList, resp) => {
        let data = { ok: 0, reject: 0, length: espList.length };
        espList.map(item => {
            data[resp[item.ip] ? 'ok' : 'reject']++;
        });
        this.errorLogger(data);
        return data;
    };

    errorLogger = (info) => {
        let date = `${moment().hour()} : ${moment().minute()}`
        let data = { [date]: info };
        fs.appendFile("./object.json", JSON.stringify(data), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });
    };

    saveFile = img => {
        require("fs").writeFile(`1.png`, img, 'base64', function (err) {
            console.log(err);
        });
    };
};

module.exports = new Esp;