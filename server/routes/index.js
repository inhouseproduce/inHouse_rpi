const actions = require('./actions');

module.exports = app => {
    app.post('/control/', (req, res) => {
        actions.control(req, res);
    });
};