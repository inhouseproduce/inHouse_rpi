const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

const api = require('./config.api');

const espConnection = require('./esp-geteaway');
const device = require('./device');

app.use(bodyParser.json());

// ESP Connection
//espConnection(app);

// ---- Testing enviroment
// const defaultconfig = require('./config.api/configs/default.json')
// device(defaultconfig);

//Run device after getting config json
api.getConfig().then( async config => {
    device(await config);
});

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});

