const scan = require('local-devices');

class Network {
    constructor() {
        this.scanNetwork = async () => {
            try {
                let scaned = await scan();
                return Object.assign({}, ...scaned.map(net => {
                    return { [net.mac]: net };
                }));
            } catch {
                //if (count <= 2) this.scanNetwork(count++);
                console.log('network scan failed')
            };
        };
    };
};

module.exports = new Network;