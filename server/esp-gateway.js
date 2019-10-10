const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/', function (req, res) {
    console.log('req.body: ',req.body)
    console.log('req.body.test: ',req.body.test)
    res.send('Got a POST request')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))