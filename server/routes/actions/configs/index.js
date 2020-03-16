const device = require('../../../../device');
const server = require('../../../../server');

module.exports = (req, res) => {
    device.stop(() => {
        server.registerServer(client => {
            device.start(client); // Start device
        });
    });
};