const api = require('./api');

const device = require('./device');
const server = require('./server');

const ip = require('ip');
console.log('----ip', ip.address())

server.registerServer()
   // let sysOp = require('./api/config/configs/saved.json')

    // device.start(sysOp, (mess) => {
    //     console.log('Device started')
    // });