const db = require('../modules');

class ActionsDB {
    constructor() {
        this.saveImages = async info => {
            try {
                const clientName = process.env.RESIN_DEVICE_NAME_AT_INIT;

                // Find Client
                let client = await db.Client.findOne(
                    { name: clientName },
                );

                // Image arr length
                let imageSize = client.images.length;

                // Delete old image when img arr size is 4
                if (imageSize >= 6) {
                    // Find Oldest image
                    let oldest = await db.Client.aggregate([
                        { $match: { name: clientName } },
                        { $unwind: '$images' },
                        { $sort: { 'images.createdAt': 1 } },
                        { $limit: 1 },
                    ]);

                    // Select oldest image _id
                    let old_id = oldest[0].images._id;

                    // Delete oldest image
                    await db.Client.updateOne(
                        { name: clientName },
                        { $pull: { images: { _id: old_id } } },
                    );
                };

                // Add new image
                await db.Client.updateOne(
                    {
                        name: process.env.RESIN_DEVICE_NAME_AT_INIT
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
            }
            catch (error) { throw error };
        };
    };
};

module.exports = new ActionsDB;