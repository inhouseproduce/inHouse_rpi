const api = require('./config.api');
const device = require('./device');

// Test env
device(require('./config.api/configs/default.json'));

// //Run device after getting config json
// api.getConfig().then( async config => {
//     device(await config);
// });