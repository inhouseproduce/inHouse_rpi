const jwt = require('jsonwebtoken');

class Authenticate {
    constructor() {
        this.authenticate = async token => {
            return await jwt.verify(token, 'shhhhh');
        };

        this.registerServer = async () => {
            return await jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: 'foobar'
                },
                'secret'
            );
        };
    };
};

module.exports = new Authenticate;