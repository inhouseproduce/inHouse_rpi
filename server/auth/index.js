const jwt = require('jsonwebtoken');
const axios = require('axios');
const ip = require('ip');

const store = require('../../store');
const { REGISTER_TOKEN } = require('../../store/actionTypes');

class Authenticate {
    constructor() {
        this.authenticate = async token => {
            return await jwt.verify(token, 'shhhhh');
        };

        this.registerServer = async client => {

        };
    };
};

module.exports = new Authenticate;