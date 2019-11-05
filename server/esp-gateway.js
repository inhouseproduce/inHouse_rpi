const express = require('express')
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const port = 3000
const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// })

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
    let data = req.body
    console.log(data)
    fs.writeFile('/home/pi/inHouse_rpi/germination_reading.txt', JSON.stringify(body), (err) => {
        console.log(err)
    });
    fs.readFile('/home/pi/inHouse_rpi/config.json', 'utf8', (err, data) => {
        let config = JSON.parse(data)
        let sitename = config.site
        let system = config.system

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let datetime = date+'_'+time;

        let filename = 'germination_reading_${datetime}.txt'
        let key = '${sitename}/system${system}/${filename}'
        // let params = {
        //     Bucket: "inhouseproduce-sites"
        //     Key: key
        //     Body: JSON.stringify(body, null, 2)
        // }
        // s3.upload(params, (err, data) => {
        //     console.log(err)
        // })
        console.log(key)
    })
    
    res.send('New germination reading received and uploaded to S3.')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
