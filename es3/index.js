const AWS = require('aws-sdk');

module.exports = (file) => {
    const BUCKET_NAME = `${camera}/${folder}`;
    const IAM_USER_KEY = '';
    const IAM_USER_SECRET = '';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: 'BUCKET_NAME'
    });

    s3bucket.createBucket(function () {
        var params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };
        s3bucket.upload(params, function (err, data) {
            if (error) {
                console.log(error)
            };
            console.log('Image successfuly uploaded')
        });
    });
};

