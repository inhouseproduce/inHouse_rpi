const arp = require('arp-a');
const fs = require('fs');

const pathname = './network/logs.txt';

class Network {
    constructor() {
        this.setNetworkList = () => {
            fs.writeFile('./esps.txt', '', err => {
                if (err) {
                    console.log('Clear file failed')
                }
                console.log('File has been cleared')
            });

            arp.table(function (err, entry) {
                if (!!err) return console.log('arp: ' + err.message);
                if (!entry) return;

                let data = `
                    "${entry.mac}":{
                        "ip": "${entry.ip}",
                        "mac": "${entry.mac}"
                    },`
                fs.appendFile('./esps.txt', data, (err) => {
                    if (err) { console.log('appending failed') }
                });
            });
        };

        this.readFile = (cb) => {
            setTimeout(() => {
                fs.readFile('./esps.txt', 'utf8', (err, data) => {
                    if (err) { console.log('reading file failed') }
                    let info = data.trim();
                    cb(info);
                });
            }, 3000);

        };
    };
};

module.exports = new Network;