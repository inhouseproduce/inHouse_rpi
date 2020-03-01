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

        // First clear old net list
        fs.appendFile(filepath, '', (err) => {
            if (err) {
                return console.log('File was not cleared');
            };
            // Write esp with set ip addresses
            fs.appendFile(filepath, data, (err) => {
                if (err) {
                    return console.log('appending failed');
                }
            });
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