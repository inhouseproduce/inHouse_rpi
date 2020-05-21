const AWS = require('aws-sdk');

module.exports = new AWS.S3({
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
    Bucket: process.env.S3_BUCKET
});