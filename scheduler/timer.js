module.exports = config => {
    if( config.on_days ){
        return `0 */${config.time_interval} * * ${config.on_days}`
    } 
    else {
        return `0 */${config.time_interval} * * * *`
    }
}