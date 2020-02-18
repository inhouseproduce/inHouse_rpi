class Record {
    constructor() {
        this.logger = (key, mess) => {
            console.log('key', key);
            console.log('message', mess)
        };
    };
};

module.exports = new Record;