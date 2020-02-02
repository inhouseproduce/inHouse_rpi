const createStore = require('./create')();

class Store {
    constructor(store) {
        this.getState = () => {
            return store.getState();
        };
        
        this.dispatch = data => {
            return store.dispatch(data);
        };
    };
};

module.exports = new Store(createStore)