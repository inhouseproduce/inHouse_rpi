const mongoose = require('mongoose');
const models = require('./modules');
const actions = require('./actions');

class MongoDB {
    constructor() {
        // Access db models
        this.db = { ...models };

        // Access custom actions
        this.actions = { ...actions };

        // Connect mongodb 
        this.connect = callback => {
            const MONGODB_URI = process.env.MONGODB_URI;
            mongoose.set('useCreateIndex', true);
            mongoose.set('useFindAndModify', false);
            
            const mdbConfig = {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true,
                useUnifiedTopology: true
            };

            mongoose.connect(MONGODB_URI, mdbConfig);
            mongoose.connection.once('open', () => {
                callback('Mongodb connection successful');
            });
        };
    };
};

module.exports = new MongoDB;