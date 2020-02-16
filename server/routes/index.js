const actions = require('./actions');
const headerAuth = require('../auth');

module.exports = app => {
    app.post('/control/', headerAuth, (req, res) => {
        actions.control(req, res);
    });
};