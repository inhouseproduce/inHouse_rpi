var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema({ });

var Client = mongoose.model('Client', ClientSchema)
module.exports = Client;