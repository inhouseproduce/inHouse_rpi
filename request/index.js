const axios = require('axios');

class Request {
    constructor() {
        this.requestAll = async (list, options, cb) => {
            let resList = list.map(async esp => {
                return await this.request(esp, options);
            });
            Promise.all(resList).then(resp => {
                cb(resp);
            });
        };

        this.request = async (esp, options) => {
            if (!esp.active) {
                return esp;
            }
            else {
                try {
                    let url = `http://${esp.ip}`;
                    let resp = await axios.post(url, options);
                    return constract(resp.data);
                }
                catch (error) {
                    return constract(false);
                };

                function constract(data) {
                    esp.response = data;
                    return esp;
                };
            };
        };
    };
};

module.exports = new Request;