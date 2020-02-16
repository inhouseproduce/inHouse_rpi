// Development environmental variables
if (!process.env.DEV_MODE) {
    require('dotenv').config()
};

const device = require('./device');
const server = require('./server');

server.registerServer(client => {
    device.start(client, data => {
        console.log('callback', data)
    });
});