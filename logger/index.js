class Logger {
    constructor(){
        this.message = action => {
            console.log(action);
        };

        this.action = (data) => {
            let { action, key } = data;
            console.log(`${key}--`, action)
        };

        
    };
};

module.exports = new Logger;