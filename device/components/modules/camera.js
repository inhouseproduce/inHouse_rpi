const moment = require('moment');

const request = require("./helpers/request");
const moduleSwitch = require('./helpers/module');

const storage = require("../../../utility/storage");

class Camera {
  constructor() {
    this.start = (config, scheduleJob) => {
      moduleSwitch.init(config, () => {
        request.sendCommand(config, { scan: true }, (resp, espList) => {
          scheduleJob(this.captureImage, espList);
        });
      });
    };

    this.captureImage = (config, callback) => {
      request.sendCommand(config, { capture: true }, (resp, espList) => {
        this.handleResponse(resp, config, savedList => {
          callback(espList, savedList);
        });
      });
    };
  };

  handleResponse = (resp, config, callback) => {
    this.saveImage(resp, (result) => {
      console.log('images has been saved', result.length)
      callback(result);
    });
  };


  saveImage = (list, callback) => {
    if (!list.length) callback([]);

    // Parse binary image
    let savedList = list.map(async item => {
      return await saveToS3(item);
    });

    parseData(savedList, parsed => {
      callback(parsed);
    });

    function parseData(savedList, cb) {
      // Parse s3 saved data
      Promise.all(savedList).then(async imgs => {
        let arr = [];
        await imgs.forEach(data => {
          if (data) arr.push(data);
        });
        cb(arr);
      }).catch(error => {
        console.log("parse 1 error", error);
        cb(false);
      });
    };

    async function saveToS3(esp) {
      let image = esp.response;

      if (image && typeof image === "string") {
        // Current time
        let time = `${moment().hour()}:${moment().minute()}`;

        // Image file name -> time + camera position
        let name = `${time}__${esp.position}`;

        // Save image in storage
        if (image && typeof image === "string" && image.length > 100) {
          return await storage.saveImage(image, name);
        }
        return false;
      }
    };
  };
};

module.exports = new Camera();
