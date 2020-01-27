const fs = require('fs');
const moment = require('moment');

class Logger {
    constructor() {
        this.message = action => {
            console.log(action);
        };

        this.action = (data) => {
            let { action, key } = data;
            if(key !== 'camera'){
                console.log(`${key}--`, action)
            };

            if (key === 'camera') {
                let info = {
                    cameras: action.length,
                    active: 0,
                    inactive: 0,
                    request: 0,
                    reqReject: 0
                };

                action.map(item => {
                    if (item.active) {
                        info.active++;
                        if(item.response){
                            info.request ++;
                        }
                        else {
                            info.reqReject ++;
                        }
                    }
                    else {
                        info.inactive++;
                    };
                });

                let time = `${moment().hour()}:${moment().minute()} \n `
                let infoData = `  Camera: ${info.cameras} / ${info.active} \n `;
                let err = `  Request:${info.request} -- Reject:${info.reqReject} \n \n`
                this.saveData(time + infoData + err);
            };
        };
    };

    saveData = data => {
        fs.appendFileSync('./logs.txt', data, (err) => {
            // In case of a error throw err. 
            if (err) throw err;
        });
    };
};

module.exports = new Logger;