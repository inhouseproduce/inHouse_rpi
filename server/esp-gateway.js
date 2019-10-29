const express = require('express')
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const port = 3000
const AWS = require('aws-sdk');
var s3 = new AWS.S3()

app.use(bodyParser.json())

app.post('/camera/:id', (req, res) => {
    let id = req.params.id
    let address = req.body['address']
    console.log('id: ',id)
    console.log('address: ',address)
    fs.readFile('/home/pi/inHouse_rpi/config.json', 'utf8', (err, data) => {
        console.log('fs data: ',data)
        let config = JSON.parse(data)
        let stack_num = Math.floor((id - 1) / 6)
        let module_num = Math.floor(((id - 1) % 6) / 2)
        let camera_num = (id - 1) % 2
        config.stacks[stack_num].modules[module_num].cameras[camera_num].host = address;
        fs.writeFile('/home/pi/inHouse_rpi/config.json', JSON.stringify(config, null, 5), (err) => {
        	console.log(err)
        });
    })
    res.send('new address '+ address +' received for camera ' + id)
})

app.post('/germination/', (req, res) => {
    console.log("New POST request detected")
    // let body = req.body
    // fs.writeFile('/home/pi/inHouse_rpi/germination_reading.txt', JSON.stringify(body), (err) => {
    //     console.log(err)
    // });
    // let params = {
    //     Bucket: "inhouseproduce-sites"
    // }
    
    res.send('New germination reading received and uploaded to server.')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))