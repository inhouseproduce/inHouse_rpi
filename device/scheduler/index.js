const CronJob = require('cron').CronJob;
const axios = require('axios');
const fs = require('fs');
// Helpers
const cronTimer = require('../helpers/cronTimer');
const gpio = require('../helpers/gpio');
const network = require('../helpers/network');

// Components 
const swtichers = require('./switchers');
const catcher = require('./stateCatcher');

// Storage
const s3Storage = require('../../es3');

class Scheduler {
    constructor() {
        this.interval = (config, action) => {
            // Initialize Gpio, Initially off by default
            gpio.initializeGpio(config, true);
            // Run initially
            swtichers.intervalSwitcher(config, action);
            // Run cron based on time_interval
            new CronJob(cronTimer.interval(config), () => {
                swtichers.intervalSwitcher(config, action);
            }).start();
        };

        this.clock = (config, action) => {
            // Initilaize GPIO pin && pwm
            gpio.initializeGpio(config, true);
            gpio.initializePwm(config, 100);

            // Map all actions
            let nextDates = config.actions.map(job => {
                // Create cron job for each action
                let cron = new CronJob(cronTimer.clock(job), () => {
                    swtichers.clockSwitcher(config, action, job);
                });
                // Start the cron 
                cron.start();
                // Return next dates in map functon
                return {
                    date: cron.nextDates(),
                    job: job
                }
            });
            // Catch current state / catcher module
            catcher.state(nextDates, job => {
                swtichers.clockSwitcher(config, action, job);
            });
        };

        this.request = async (config, action) => {
            //let devices = await network.devices();
            setInterval(() => {
                config.esp.map(async esp => {
                    try {
                        let sleepTime = `time-${config.time_interval}`;
                        let resp = await axios.post(`http://${esp.ip}`, sleepTime);
                        require("fs").writeFile(`${esp.position}.png`, resp.data, 'base64', function (err) {
                            console.log(err);
                        });
                    }
                    catch( error ){
                        throw error;
                    }
                });
            }, 60000);
        };
    };
};

module.exports = new Scheduler;