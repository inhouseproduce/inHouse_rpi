const AWS = require('aws-sdk');

class s3 {
    constructor(){
        this.s3bucket = new AWS.S3({
            accessKeyId: 'IAM_USER_KEY',
            secretAccessKey: 'IAM_USER_SECRET',
            Bucket: 'BUCKET_NAME'
        });

        this.saveFile = data => {
            let { image, backet} = data;
            this.s3bucket.createBucket(function () {
                var params = {
                    Bucket: 'BUCKET_NAME',
                    Key: file.name,
                    Body: file.data
                };
                this.s3bucket.upload(params, function (err, data) {
                    if (error) {
                        console.log(error)
                    };
                    console.log('Image successfuly uploaded')
                });
            });
        };
    };
};

module.exports = new s3;