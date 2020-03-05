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
            let list = validate(data);
            console.log('list')
            if (list) {
                try {
                    return await db.Record.updateOne({ id }, {
                        $set: { images: list }
                    }, { new: true });
                } catch (err) { throw err };
            }
            function validate(data) {
                data.map((item, index) => {
                    if (!item) {
                        data.splice(index, 1);

                    }
                });
                return data;
            };
        };
    };
};

module.exports = new ActionsDB;