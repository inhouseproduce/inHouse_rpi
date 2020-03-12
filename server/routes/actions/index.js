const control = require('./control');
const cameras = require('./cameras');
const configs = require('./configs');

module.exports = {
    control: (req, res) => control(req, res),
    cameras: (req, res) => cameras(req, res),
    configs: (req, res) => configs(req, res)
};
