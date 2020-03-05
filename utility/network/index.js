const arp = require('arp-a');
const fs = require('fs');

const filepath = './utility/network/netlist.txt';


module.exports.networkList = callback => {
    arp.table((err, entry) => {
        if (!!err) return console.log('arp: ' + err.message);
        if (!entry) return;

        let data = `"${entry.mac}" : {
            "ip": "${entry.ip}",
            "mac": "${entry.mac}"
        },`;

        // Write esp with set ip addresses
        fs.writeFile(filepath, '', (err) => {
            if (err) {
                return console.log('Scaning network failed');
            }
        });
        fs.appendFile(filepath, data, (err) => {
            if (err) {
                return console.log('Scaning network failed');
            }
        });
    });

    setTimeout(() => {
        fs.readFile(filepath, 'utf8', (err, netList) => {
            if (err) {
                return console.log('reading file failed');
            };

            // Get network list as string convert to json
            netList = netList.trim();
            netList = netList.substring(0, netList.length - 1);
            callback(JSON.parse(`{${netList}}`));
        });
    }, 3000);
};