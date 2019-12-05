const fs = require('fs');
const cmd = require('node-cmd')
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
    app.post('/camera/:id', (req, res) => {
        console.log("New POST request detected")
        let mac = req.body['id']
        let address = req.body['address']
        console.log('MAC: ',mac)
        console.log('address: ',address)
        fs.readFile('/app/inHouse_rpi/config.json', 'utf8', (err, data) => {
            let config = JSON.parse(data)
            let id = config.esp32[mac]
            console.log('Camera ID: ',id)
            let stack_num = Math.floor((id - 1) / 6)
            let module_num = Math.floor(((id - 1) % 6) / 2)
            let camera_num = (id - 1) % 2
            config.stacks[stack_num].modules[module_num].cameras[camera_num].host = address;
            fs.writeFile('/app/inHouse_rpi/config.json', JSON.stringify(config, null, 5), (err) => {
                if (err) {
                    console.log(err)
                }
            })
            res.send(""+id)
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

        fs.readFile('/app/inHouse_rpi/config.json', 'utf8', (err, data) => {
            let config = JSON.parse(data)
            let sitename = config.site
            let system = config.system
            let pathway = "s3://inhouseproduce-sites/" + sitename + "/system" + system + "/" + "germination/" + filename
            // let pathway = sitename + "/system" + system + "/" + "germination/" + filename
            // const params = {
            //     Bucket: 'inhouseproduce-sites',
            //     Key: pathway,
            //     Body: JSON.stringify(body, null, 2)
            // }
            // s3.upload(params, (err, data) => {
            //     if (err) {
            //         console.log(err)
            //     }
            //     console.log(`File uploaded successfully. ${data.Location}`)
            // })
            cmd.get('s3cmd put ' +  filename + ' ' + pathway, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Update successful.")
                    fs.unlink(filename, (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            })
            res.send('New germination reading received and uploaded to S3.')
        })
    });
}