const db = require('../modules');

class ActionsDB {
    constructor() {
        this.findClient = async () => {
            const clientName = process.env.RESIN_DEVICE_NAME_AT_INIT;
            return await db.Client.findOne({ name: clientName });
        };

        this.clientLogs = async id => {
            return await db.Record.findOne({ id });
        };

        this.saveImages = async (id, data) => {
            return await db.Record.updateOne({ id }, {
                $set: { images: data }
            }, { new: true });
        };
    };
};

module.exports = new ActionsDB;