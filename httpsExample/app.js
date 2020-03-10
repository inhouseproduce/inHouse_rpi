const Express = require("express");
const HTTPS = require("https");
const FS = require("fs");

const app = Express();
const http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

app.get("*", function(request, response, next){
    if (!request.secure) {
        response.redirect("https://localhost:443");
    } else {
        next();
    }
});
    
app.get("/", (request, response, next) => {
    response.send({ "message": "Hello World" });
});

HTTPS.createServer({
    key: FS.readFileSync("server.key"),
    cert: FS.readFileSync("server.cert")
}, app).listen(443, () => {
    console.log("Listening at :443...");
});

