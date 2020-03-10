const moment = require("moment");
const axios = require("axios");
const GPIO = require("rpio");

const network = require("../../utility/network");
const storage = require("../../utility/storage");

class Camera {
  constructor() {
    this.start = (config, scheduleJob) => {
      this.camera(config).init(cameraOff => {
        this.requestAll(config.esp, { scan: true }, (resp, list) => {
          scheduleJob(this.captureImage, list);
          cameraOff();
        });
      });
    };

    this.captureImage = (config, callback) => {
      this.camera(config).on(cameraOff => {
        this.requestAll(config.esp, { capture: true }, (response, espList) => {
          this.handleCameraResponse(response, config, savedList => {
            callback(espList, savedList);
            cameraOff();
          });
        });
      });
    };
  }

  handleCameraResponse = (resp, config, callback) => {
    this.handleFailedCameras(resp, config, result => {
      Promise.all(result).then(test => {
        let failed = 0;
        test.map(item => {
          if (!item.response) {
            failed++, console.log("item.position", item.position);
          }
        });
        console.log("failed", failed);
        this.saveImage(test, arr => {
          callback(arr);
        });
      });
    });
  };

  handleFailedCameras = async (resp, config, callback) => {
    let x = true;
    await resp.map(async item => {
      // Check whats is item =====>>>
      console.log("checkpoint--->");
      if (item && item.active && !item.response) {
        console.log('inactive checkpoint---->')
        if (x) {
          this.camera({ pin: 33 }).init(() => {
            x = false;
          });
        }
        this.reTakeImage([item], async retaken => {
          console.log("retaken");
          Promise.all(retaken).then(async data => {
            // DOSNT REACH RECOVERed ====>
            console.log("Recovered", resp[index].position);
            resp[index].response = await data;
          });
        });
      }
    });
    callback(resp);
  };

  reTakeImage = (esps, callback) => {
    this.requestAll(esps, { capture: true }, resp => {
      callback(resp);
    });
  };

  camera = config => {
    const cameraOff = () => {
      GPIO.write(config.pin, GPIO["HIGH"]);
      console.log("camera off -->");
    };
    return {
      init: cb => {
        GPIO.open(config.pin, GPIO.OUTPUT, GPIO["HIGH"]);
        GPIO.write(config.pin, GPIO["HIGH"]);
        setTimeout(() => {
          GPIO.write(config.pin, GPIO["LOW"]);
          setTimeout(() => {
            cb(cameraOff);
            console.log("gpio initialize");
          }, 500);
        }, 1000);
      },
      on: cb => {
        GPIO.write(config.pin, GPIO["LOW"]);
        setTimeout(() => {
          if (cb) cb(cameraOff);
          else return;
          console.log("camera On");
        }, 500);
      },
      off: cb => {
        GPIO.write(config.pin, GPIO["HIGH"]);
        if (cb) cb();
        else return;
      }
    };
  };

  saveImage = (list, callback) => {
    if (!list.length) callback([]);

    // Parse binary image
    Promise.all(list)
      .then(async resp => {
        let savedList = resp.map(async item => {
          return await this.saveToS3(item);
        });
        // Parse s3 saved data
        Promise.all(savedList)
          .then(async imgs => {
            let arr = [];
            await imgs.forEach(data => {
              if (data) arr.push(data);
            });
            callback(arr);
          })
          .catch(error => {
            console.log("parse 1 error", error);
            callback(false);
          });
      })
      .catch(err => {
        console.log("parsing error", err);
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

  requestAll = async (esps, command, callback) => {
    this.scanEsp(esps, async list => {
      try {
        let response = await list.map(async esp => {
          try {
            let image = await axios.post(`http://${esp.ip}/`, command);
            esp.response = image.data;
            return esp;
          } catch (err) {
            esp.response = false;
            return esp;
          }
        });
        callback(await response, list);
      } catch (error) {
        callback(false);
      }
    });
  };

  scanEsp = async (espList, register) => {
    network.networkList(list => {
      if (list) {
        // Map esp list, match with ip on the network
        let camera_esp = espList.map(esp => {
          return match(esp, list[esp.mac]);
        });

        register(camera_esp);

        function match(esp, activeEsp) {
          esp.ip = activeEsp && activeEsp.ip;
          esp.active = activeEsp ? true : false;
          return esp;
        }
      }
    });
  };
}

module.exports = new Camera();
