var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RecordSchema = new Schema({
    id: {
        type: String
    },

    record: {
        type: Object
    },

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

var Record = mongoose.model("Record", RecordSchema)
module.exports = Record;