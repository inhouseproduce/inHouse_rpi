const express = require('express')
const app = express()
const port = 3000

app.post('/', function (req, res) {
    console.log('req: ',req)
    res.send('Got a POST request')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))