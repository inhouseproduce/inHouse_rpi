const express = require('express');
const bodyParser = require('body-parser');

class Server {
    constructor() {
        this.start = () => {
            const PORT = 3000;
            const app = express();

            app.use(bodyParser.json());

            app.post('/', (req, res) => {
                console.log('req', res)
            });

            app.listen(PORT, () => {
                console.log(`🌎 ==> Server now on port ${PORT}!`);
            });
        };
    };
};

module.exports = Server;