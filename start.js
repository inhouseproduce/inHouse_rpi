// // Development environmental variables
if (!process.env.ENV_MODE) {
    require('dotenv').config();
};

// Libs
const Device = require('./device');
const server = require('./server');
const mongodb = require('./utility/mongodb');

const logger = require('./logger');

// Register Server api
server.registerServer(client => {
    // Initialize mongodb
    mongodb.connect(async () => {
        // Start device
        let device = new Device(logger, client);

        device.start();
    });
});