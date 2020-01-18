const fs = require('fs');
const moment = require('moment');

class Logger {
    constructor(){
        this.getInfoData = () => {

        };

        this.writeData = () => {

        };
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

module.exports = new Logger;