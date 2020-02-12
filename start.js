const device = require('./device');
const server = require('./server');

server.registerServer(client => {
   device.start(client, data => {
       console.log('Device started')
   });
});