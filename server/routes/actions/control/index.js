const store = require('../../../../store');
const gpio = require('../../../../utility/gpio');

module.exports = (req, res) => {
    let { action } = req.body; // Body
    let { jobs, config } = store.getState(); // State
    let currConfig = config.engine[action]; // Job

    if (req.body.hasOwnProperty('lock')) {
        // Get jobs list from store
        let job = jobs[action];

        if (req.body.lock) {
            job.start();
            setTimeout(() => {
                job.stop();
            }, 10 * 60 * 60000);// 10 mintues lock period
        }
        else {
            job.stop();
            setTimeout(() => {
                job.start();
            }, 10 * 60 * 60000);// 10 mintues lock period
        };
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