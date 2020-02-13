const device = require('./device');
const server = require('./server');
const writeToMongo = require('./logger.js').writeToMongo;
// const mongoConnection = require('.logging/mongo.js')
// mongoConnection()


server.registerServer(client => {
    device.start(client, data => {
        console.log('callback', data)

        //writes data to client in mongodb
        writeToMongo(client, data)
    });
});