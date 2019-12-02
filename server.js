const express = require('express')
const bodyParser = require("body-parser")
const app = express()

const espConnection = require('./esp-geteaway');
const software = require('./software');

const PORT = 3000

app.use(bodyParser.json());

// Run each code
espConnection(app);
software();

app.listen(PORT, () => {
    console.log(`🌎 ==> Server now on port ${PORT}!`);
});