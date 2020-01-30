const gpio = require('../../../utility/gpio');

module.exports = (app, dev) => {
    app.post('/', (req, res) => {
        let { store, sysOp } = dev;
        let { status, action, level } = req.body;

        store.getState().jobs[action].stop();

        let config = sysOp.config.engine[action];

        if (status)
            gpio.writeGpio(config, status);

        if (level)
            gpio.writePwm(config, level);

        setTimeout(() => {
            store.getState().jobs[action].start();
        }, 3000);
        
        res.status(200).json('Response');
    });
};
