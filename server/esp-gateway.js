const express = require('express')
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/camera/:id', function (req, res) {
    let id = req.params.id
    let address = req.body['address']
    console.log('id: ',id)
    console.log('address: ',address)
    fs.readFile('/home/pi/inHouse_rpi/config.json', 'utf8', function(err, data) {
        console.log('fs data: ',data)
        var config = JSON.parse(data);
        let stack_num = Math.floor((id - 1) / 6);
        let module_num = Math.floor(((id - 1) % 6) / 2);
        let camera_num = (id - 1) % 2;
        config.stacks[stack_num].modules[module_num].cameras[camera_num].host = address;
        fs.writeFile('/home/pi/inHouse_rpi/config.json', JSON.stringify(config, null, 5), (err) => {
        	console.log(err)
        });
    })
    res.send('new address '+ address +' received for camera ' + id)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))