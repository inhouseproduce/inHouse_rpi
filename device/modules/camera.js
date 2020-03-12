const control = require("./control");
const storage = require("../../utility/storage");

class Camera {
  constructor() {
    this.start = (config, scheduleJob) => {
      control.module.init(config, () => {
        control.sendCommand(config, { scan: true }, (resp, espList) => {
          scheduleJob(this.captureImage, espList);
        });
      });
    };

    this.captureImage = (config, callback) => {
      control.sendCommand(config, { capture: true }, (resp, espList) => {
        control.handleResponse(espList, config, savedList => {
          callback(espList, savedList);
        });
      });
    };
  };

  saveImage = (list, callback) => {
    if (!list.length) callback([]);

    // Parse binary image
    let savedList = list.map(async item => {
      return await this.saveToS3(item);
    });

    // Parse s3 saved data
    Promise.all(savedList).then(async imgs => {
      let arr = [];
      await imgs.forEach(data => {
        if (data) arr.push(data);
      });
      callback(arr);
    }
    ).catch(error => {
      console.log("parse 1 error", error);
      callback(false);
    });
  };

  saveToS3 = async esp => {
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

module.exports = new Camera();
