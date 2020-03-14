const arp = require('arp-a');
const fs = require('fs');

const filepath = './utility/network/netlist.txt';

const networkList = callback => {
    arp.table((err, entry) => {
        if (!!err) return console.log('arp: ' + err.message);
        if (!entry) return;

        let data = `"${entry.mac}" : {
            "ip": "${entry.ip}",
            "mac": "${entry.mac}"
        },`;

        // Write esp with set ip addresses
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

const matchEsp = async (espList, register) => {
    networkList(list => {
        if (list) {
            // Map esp list, match with ip on the network
            let camera_esp = espList.map(esp => {
                return match(esp, list[esp.mac]);
            });

            register(camera_esp);

            function match(esp, activeEsp) {
                esp.ip = activeEsp && activeEsp.ip;
                esp.active = activeEsp ? true : false;
                return esp;
            };
        };
    });
};

module.exports.matchEsp = matchEsp;
module.exports.networkList = networkList;

