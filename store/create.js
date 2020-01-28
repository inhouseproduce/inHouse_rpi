module.exports = () => {
    const { createStore } = require('redux');
    const reducer = require('./reducer');

    return createStore(reducer);
};