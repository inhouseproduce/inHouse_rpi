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

        this.removeImages = async id => {
            return await db.Record.updateOne({ id },
                { $set: { images: [] } },
            );
        };

        this.saveImages = async (id, data) => {
            return await db.Record.updateOne({ id }, {
                $push: {
                    images: [{
                        name: data.Key,
                        image: data.Location,
                        createdAt: Date.now()
                    }]
                }
            }, { new: true });
        };
    };
};

module.exports = new ActionsDB;