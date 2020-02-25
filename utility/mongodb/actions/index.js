const db = require('../modules');

class ActionsDB {
    constructor() {
        this.saveImages = async info => {
            let client = await findClient();
            let record = await findRecord();

            // Delete oldest image
            removeLatest();

            // Update image list
            updateImage();

            async function findClient() {
                const clientName = process.env.RESIN_DEVICE_NAME_AT_INIT;
                // Find Client
                return await db.Client.findOne(
                    { name: clientName },
                );
            };

            async function findRecord() {
                return await db.Record.findOne({
                    id: client._id
                });
            };

            async function removeLatest() {
                if (record.images.length >= 6) {
                    await db.Record.updateOne(
                        { id: client._id },
                        {
                            $pull: {
                                images: {
                                    _id: record.images[0]._id
                                }
                            }
                        },
                    );
                }
            };

            async function updateImage() {
                // Add new image
                await db.Record.updateOne(
                    {
                        id: client._id
                    },
                    {
                        $push: {
                            images: [{
                                name: info.Key,
                                image: info.Location,
                                createdAt: Date.now()
                            }]
                        }
                    }
                );
            };
        }
    };
};

module.exports = new ActionsDB;