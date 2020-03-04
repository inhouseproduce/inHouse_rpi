const s3Storage = require('./config');

class Storage {
    constructor() {
        this.saveImage = async (image, name, callback) => {
            if (image && typeof image === 'string') {
                let buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                console.log('image', image)
                const params = {
                    Bucket: 'unit-images',
                    ACL: 'public-read',
                    Key: `${name}.jpeg`,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg',
                    Body: buffer
                };

                // If callback function
                if (typeof callback === 'function') {
                    s3Storage.upload(params, (err, data) => {
                        if (err) return err;
                        callback(data);
                    });
                };

                // return result async 
                try {
                    return await s3Storage.upload(params).promise();

                } catch (err) { return err };
            };
        };
    };
};

module.exports = new Storage;