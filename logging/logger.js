const Logging = require('./Logging.js');

function findName(list, name)
{
    return list.clients.find(element => element.client_name === name)
}

function writeToMongo(name, message)
{
    Logging.find({}, function (err, client_list) 
    {
        const user = client_list[0]
        if(!err)
        {
            var client = findName(user, name) || null
            if (client)
            {     
                client.logs.push(message)
                console.log("pushed message")
                user.save()
            }
            else
                console.log("did not find client ")
        }
        else 
            console.log("there's an error:  ", err)      
    })
}

module.exports = {
    writeToMongo: writeToMongo
}
