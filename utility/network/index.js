const arp = require('arp-a');
const fs = require('fs');

const filepath = './utility/network/netlist.txt';

class Network {
    constructor() {
        this.setNetworkList = async (callback) => {
            // Clear file content
            fs.writeFile(filepath, '', err => {
                if (err) {
                    console.log('Clear file failed')
                }
            });

            // Scan network and set ip addresses
            await arp.table((err, entry) => {
                if (!!err) return console.log('arp: ' + err.message);
                if (!entry) return;

                let data = `
                    "${entry.mac}":{
                        "ip": "${entry.ip}",
                        "mac": "${entry.mac}"
                    },`;

                // Write esp with set ip addresses
                fs.appendFile(filepath, data, (err) => {
                    if (err) {
                        return console.log('appending failed');
                    };
                });
            });
            callback();
        };

        this.readFile = callback => {
            console.log('reading file -------')
            // Create async await for data to be written
            setTimeout(() => {
                fs.readFile(filepath, 'utf8', (err, netList) => {
                    if (err) {
                        return console.log('reading file failed');
                    };

                    netList = netList.trim();
                    netList = netList.substring(0, netList.length - 1);

                    callback(JSON.parse(`{${netList}}`));
                });
            }, 3000);
        };
    };
};

module.exports = new Network;