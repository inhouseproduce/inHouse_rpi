const api = require('./api/config');

const device = require('./device');
const server = require('./server');

const ip = require('ip');
console.log('----ip', ip.address())

api.getConfig().then(sysOp => {
    server.start(sysOp, (mess) => {
        console.log('server is runing')
    });

    device.start(sysOp, (mess) => {
        console.log('Device started')
    });
});

