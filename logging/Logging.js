const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const LoggingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    clients: [{
        client_name: String,
        logs: [String]
    }]
});

const Logging = mongoose.model("logging", LoggingSchema, "logging");
module.exports = Logging;