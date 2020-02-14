const routes = require('./routes.json');
const actions = require('./actions');

module.exports = app => {
    routes.routes.map(route => {
        let { method, action, url } = route;
        app[method](url, (req, res) => {
            actions[action](req, res);
        });
    });
};