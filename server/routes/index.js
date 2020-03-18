const actions = require('./actions');
const headerAuth = require('../auth');

module.exports.initializeRoutes = app => {
    app.post('/control/', headerAuth, (req, res) => {
        actions.control(req, res);
    });

    app.get('/image/update/', (req, res) => {
        actions.cameras(req, res);
    });

    app.get('/update/config/', (req, res) => {
        actions.configs(req, res);
    });
};