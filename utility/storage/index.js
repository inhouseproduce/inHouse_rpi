const s3Storage = require('./config');

class Storage {
    constructor() {
        this.saveImage = (image, name, callback) => {
            if (image) {
                let buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                const params = {
                    Bucket: 'unit-images',
                    ACL: 'public-read',
                    Key: `${name}.jpeg`,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg',
                    Body: buffer
                };

                s3Storage.upload(params, (err, data) => {
                    if (err) return err;
                    callback(data);
                    console.log('image has been saved', data)
                });
            };
        };
    };
};

module.exports = new Storage;