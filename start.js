// Development environmental variables
// if (!process.env.ENV_MODE) {
//     require('dotenv').config()
// };

// Libs
const device = require('./device');
const server = require('./server');
const mongodb = require('./utility/mongodb');

// Register Server api
server.registerServer(client => {
    // Initialize mongodb
    mongodb.connect(() => {
        // Start device
        device.start(client);
    });
});