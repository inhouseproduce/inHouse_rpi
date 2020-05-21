var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    client: {
        type: String
    }
});

var Client = mongoose.model("Client", ClientSchema)
module.exports = Client;