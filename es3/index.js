const AWS = require('aws-sdk');

module.exports = (image, name) => {
    const s3bucket = new AWS.S3({
        accessKeyId: 'AKIAJZ5WOX3F3IK63LKQ',
        secretAccessKey: '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',
        Bucket: 'unit-images'
    });
    
    // Setting up S3 upload parameters
    const params = {
        Bucket: 'unit-images',
        Key: name,
        Body: image
    };
    
    // Uploading files to the bucket
    s3bucket.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};