
const express = require('express');
const bodyParser = require('body-parser');

const device = require('./device');

const PORT = 3000
const app = express();

app.use(bodyParser.json());

device.start();

app.post('/', (req, res) => {
    console.log('req', res)
});

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});
