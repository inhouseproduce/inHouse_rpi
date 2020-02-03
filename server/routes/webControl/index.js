const gpio = require('../../../utility/gpio');

module.exports = (app, dev) => {
    app.post('/', (req, res) => {
        console.log('req.headers', req.headers)
        // let { store, sysOp } = dev;
        // let { status, action, level } = req.body;

        // let config = sysOp.config.engine[action];

        // gpio.writeGpio(config, status);

        // if (level)
        //     gpio.writePwm(config, level);

        res.status(200).json('Response');
    });
};
