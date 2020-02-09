const device = require('./device');
const server = require('./server');

const ip = require('ip');
console.log('----ip', ip.address())

server.registerServer(config => {
   // let sysOp = require('./api/config/configs/saved.json')

   // device.start(sysOp, (mess) => {
   //     console.log('Device started')
   // });
});
