const device = require('../../../../device');
const api = require('../../../../server/api');

module.exports = (req, res) => {
    device.stop(() => {
        api.register(config => {
            device.start(config);
        });
    });

    res.status(200).end();
};