const Express = require("express");
const HTTPS = require("https");
const pem = require('pem');
const app = Express();
const http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

app.get("*", function(request, response, next){
    console.log('Get called')
    if (!request.secure) {
        response.redirect("https://localhost:443");
    } else {
        next();
    }
});
 
pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    if (err) {
        throw err
    }
    
    app.get("/", (request, response, next) => {
        console.log('Return message');
        response.send({ "message": "Hello World" });
    });

    HTTPS.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(443, () => {
        console.log("Listening at :443...");
    });
})


