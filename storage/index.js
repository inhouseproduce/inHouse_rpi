const s3Storage = require('./config');

class Storage {
    constructor() {
        this.saveImage = (image, name) => {
            const params = {
                Bucket: 'unit-images',
                Key: `${name}.jpg`,
                Body: image
            };

            if (image) {
                s3Storage.upload(params, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`File uploaded successfully`);
                });
            };
        };
    };
};

module.exports = new Storage;