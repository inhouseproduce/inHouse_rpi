const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/camera/:id', function (req, res) {
    let id = req.params.id
    let address = req.body['address']
    console.log('id: ',id)
    console.log('address: ',address)
    res.send('new address'+ address +' recieved for camera '+id)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))