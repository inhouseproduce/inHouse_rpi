const gpio = require('../../../utility/gpio');

module.exports = (app, dev) => {
    app.post('/control/', (req, res) => {
        console.log('body---', req.body)
        // let { store, sysOp } = dev;
        // let { status, action, level } = req.body;

        // let config = sysOp.config.engine[action];

        // gpio.writeGpio(config, status);

        // if (level)
        //     gpio.writePwm(config, level);

        res.status(200).json('Response');
    });
};
