const arp = require('arp-a');
const fs = require('fs');

const filepath = 'utility/network/netlist.txt';

class Network {
    constructor() {
        this.setNetworkList = () => {
            fs.writeFile(filepath, '', err => {
                if (err) {
                    console.log('Clear file failed')
                }
            });

            arp.table((err, entry) => {
                if (!!err) return console.log('arp: ' + err.message);
                if (!entry) return;

                let data = `
                    "${entry.mac}":{
                        "ip": "${entry.ip}",
                        "mac": "${entry.mac}"
                    },`;

                fs.appendFile(filepath, data, (err) => {
                    if (err) { console.log('appending failed') }
                });
            });
        };

        this.readFile = (cb) => {
            setTimeout(() => {
                fs.readFile(filepath, 'utf8', (err, netList) => {
                    if (err) { 
                        return console.log('reading file failed');
                    };

                    netList = netList.trim();
                    netList = netList.substring(0, netList.length - 1);

                    cb(JSON.parse(`{${netList}}`));
                });
            }, 3000);
        };
    };
};

module.exports = new Network;