const SHT31 = require('raspi-node-sht31');
const sht31 = new SHT31();
const fs = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid-random')

// Change KEY and SECRET to match with site
KEY = 'AKIAZSWGEH2KGH2NUZ5U'
SECRET = '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'
temp_f = 0.5
temp_c = 0.1
humidity = 100.0

const s3 = new AWS.S3({
  accessKeyId: KEY,
  secretAccessKey: SECRET
});

fileName = 'index.txt'

const uploadFile = () => {
    fn = uuid().toString()
    fileName = fn + '.txt'
    // JSON
    fs.writeFile(fileName, '{ \"uuid\" : \"' + fn + "\" , " + '\"temp_c\" : ' + temp_c.toString() + " , " + '\"temp_f\" : ' + temp_f.toString() + " , " + '\"humidity\" : ' + humidity.toString() + ' }', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });     
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'hthnc', // Change to our S3: pass your bucket name
            Key: 'rpi/test/' + fileName, // file will be saved as testBucket/contacts.csv
            Body: JSON.stringify(data, null, 2)
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
        });
    });
};
 
// Read temperature and display in console in F with Relative humidity
sht31.readSensorData().then((data) => {
  // Temp in Fahrenheit -- If you get floating point rouding errors, multiply by ten before rouding, divide by 10 after.
  temp_f = Math.round(data.temperature * 1.8 + 32);
  temp_c = Math.round(data.temperature);
  humidity = Math.round(data.humidity);

  console.log(`The temperature is: ${temp} degress F\nThe Humidity is: ${humidity}%`);
  uploadFile();
 
}).catch(console.log);