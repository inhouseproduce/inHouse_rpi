const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

const espConnection = require('./esp-geteaway');

const configApi = require('./config.api');
const device = require('./device');

app.use(bodyParser.json());

// ESP Connection
//espConnection(app);

// Run device after getting config json
configApi().then( async config => {
    device(await config);
});


app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});

