const scanNetwork = require('local-devices');

class network {
    constructor(){
        this.devices = async () => {
            const scaned = await scanNetwork();
            let netList = {};

            scaned.map(net => {
                netList[net.mac] = net
            });
            return netList;
        };
    };
};

module.exports = new network;