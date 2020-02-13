const device = require('./device');
const server = require('./server');

server.registerServer(client => {
    console.log('env', process.env)

    device.start(client, data => {
        console.log('Device started')
    });
});