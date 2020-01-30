const store = require('./store/create')();
const api = require('./api/config');

const Device = require('./device');
const Server = require('./server');

const ip = require('ip');

console.log('ip', ip.address())

api.getConfig().then(sysOp => {
    const server = new Server({ store, sysOp });
    server.start();

    const device = new Device({ store, sysOp });
    device.start();
});
