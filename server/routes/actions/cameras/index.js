const store = require('../../../../store');
const camera = require('../../../../device/modules/camera');

module.exports = (req, res) => {
    let config = store.getState().config.modules.camera;

    console.log('request--->')
    camera.captureImage(config, (data) => {
        console.log('data', data)
        res.status(200).end();
    });
};