const api = require('./api/config');
const store = require('./store/create')();

const Device = require('./device');
const Server = require('./server');

api.getConfig().then(sysOp => {
    const server = new Server({ store, sysOp });
    server.start();

    const device = new Device({ store, sysOp });
    device.start();
});
