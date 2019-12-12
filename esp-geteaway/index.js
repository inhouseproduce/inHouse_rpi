const fs = require('fs');
const esp32 = require('../es3')
const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: balena.models.application.envVar.get('inhouse-produce', 'AccessKey', function(error, value) {
//         if (error) throw error;
//     }),
//   secretAccessKey: balena.models.application.envVar.get('inhouse-produce', 'SecretKey', function(error, value) {
//         if (error) throw error;
//     })
// })

module.exports = (app) => {
    app.post('/camera/', (req, res) => {
        console.log("New POST request detected")
        // console.log(req.body)
        let mac = req.body.id
        let buf = req.body.image
        console.log('MAC: ',mac)
        console.log('Buf: ',buf)
        // converts base64 buffer to an image file
        let datajpg = "data:image/jpg;base64," + buf;
        let base64Image = datajpg.split(';base64,').pop();
        fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
            console.log('File created');
        });
        fs.readFile('/app/device/config.json', 'utf8', (err, data) => {
            let config = JSON.parse(data)
            let id = config.camera[mac]
            console.log('Camera ID: ',id)
            let stack_num = Math.floor((id - 1) / 6);
            let module_num = Math.floor(((id - 1) % 6) / 2);
            let camera_num = (id - 1) % 2;
            let content = fs.readFileSync('image.png')
            let obj = {
                stack: stack_num,
                module: module_num,
                camera: camera_num,
                name: 'image.jpg',
                data: content
            };
            esp32(obj);
            res.send("New image received for camera " + id + " and uploaded to S3.")
        })
    })

    app.post('/germination/', (req, res) => {
        console.log("New POST request detected")
        let body = req.body
        console.log(body)
        let today = new Date()
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        let datetime = date + '_' + time
        let filename = 'germination_readings_' + datetime + '.txt'

        fs.writeFile(filename, JSON.stringify(body), (err) => {
            if (err) {
                console.log(err)
            }
        })

        fs.readFile('/app/device/config.json', 'utf8', (err, data) => {
            let config = JSON.parse(data)
            let sitename = config.site
            let system = config.system
            let pathway = "inhouseproduce-sites/" + sitename + "/system" + system + "/" + "germination/"
            const params = {
                Bucket: pathway,
                Key: filename,
                Body: JSON.stringify(body, null, 2)
            }
            // s3.upload(params, (err, data) => {
            //     if (err) {
            //         console.log(err)
            //     }
            //     if (data) {
            //         fs.unlink(filename, (err) => {
            //             if (err) {
            //                 console.log(err)
            //             }
            //         })
            //     }
            //     console.log(`File uploaded successfully. ${data.Location}`)
            // })
            res.send('New germination reading received and uploaded to S3.')
        })
    });
}