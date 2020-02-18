var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    images: [{
        name: {
            type: String
        },
        image: {
            type: String,
        },
        createdAt: {
            type: Date
        }
    }]
});

var Client = mongoose.model('Client', ClientSchema)
module.exports = Client;