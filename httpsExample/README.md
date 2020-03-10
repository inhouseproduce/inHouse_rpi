# HTTPS GET and Server Publish

### app.js
    Essentially runs and redirects all http requests to https and handles using https
    Runs off self generated key: https://www.thepolyglotdeveloper.com/2018/11/create-self-signed-certificate-nodejs-macos/

### get.js
    Client server example for this project
    Allows a specific certificate set in pem format: simply fix by running:
        $ cat server.cert > key.pem
    NOTES:
        Common name should be what your label is for the certificated > Implication is that we will need a static IP address for this
        Possible fix is to limit your IP to using private IP address on the network -> Have not explored yet