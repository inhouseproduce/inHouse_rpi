const store = require('../../../../store');

module.exports = (req, res) => {
    let { action } = req.body;
    let { jobs, config } = store.getState();
    let currConfig = config.engine[action];

    if (req.body.hasOwnProperty('lock')) {
        // Get jobs list from store
        let job = jobs[action];

        if (req.body.lock) {
            job.start();
        }
        else job.stop();
    };

    if (req.body.hasOwnProperty('status')) {
        let { status } = req.body;
        gpio.writeGpio(currConfig, status);
    };

    if (req.body.hasOwnProperty('level')) {
        let { level } = req.body;
        gpio.writePwm(currConfig, level);
    };

    res.status(200).json('Response');
};