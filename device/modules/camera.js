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

    this.captureImage = (config, callback, options) => {
      this.camera(config).on(cameraOff => {
        this.requestAll(config.esp, { capture: true }, (resp, list) => {
          if(options.save){
            this.handleSaveImage(resp, arr => {
              callback(list, arr);
              cameraOff();
            });
          }
          else {
            callback(resp,list)
          }
        });
      });
    };
  }

  handleSaveImage = (resp, callback) => {
    console.log("response", await resp);
    resp.map(item=>{
      if(!item.response){
        
      }
    })
    this.saveImage(resp, arr => {
      callback(arr);
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
