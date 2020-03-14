const axios = require('axios');

module.exports = async (list, command, callback) => {
    // Request to all esps
    let data = await list.map(async esp => {
        return await request(esp);
    });

    callback(data);

    // Make request
    async function request(esp) {
        try {
            let res = await axios.post(`http://${esp.ip}/`, command);
            console.log('imp response', res)
            if (res.data) {
                esp.response = res.data;
                return esp;
            }
            else {
                return handleError(esp);
            };
        }
        catch (err) {
            return handleError(esp);
        };
    };

    // Handle error
    function handleError(espData) {
        espData.response = false;
        return espData;
    };
};