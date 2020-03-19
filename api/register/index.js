const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const store = require("../../store");
const handleJson = require("./handleJson");

class Api {
  constructor() {
    this.register = async callback => {
      // Gether process.env data
      let { ALGORITHM, JWT_SECRET } = process.env;

      const clientName = process.env.RESIN_DEVICE_NAME_AT_INIT;
      const clientUuid = process.env.BALENA_DEVICE_UUID;

      // Hash uuid
      let hashedUuid = bcrypt.hashSync(clientUuid, 10);

      // Generate token
      let token = await jwt.sign(
        {
          client: clientName,
          uuid: hashedUuid
        },
        JWT_SECRET,
        {
          algorithm: ALGORITHM
        }
      );

      // Server endpoint
      let endpoint = `${process.env.ENDPOINT_URL}/client/identify/`;

      // Make get request to register and get config
      this.request(endpoint, token, async data => {
        console.log('data', data)
        if (data) {
          try {
            // Store client data in store
            let decoded = await jwt.verify(data.sessionToken, JWT_SECRET);

            // Save decoded data
            if (decoded) {
              // Save session token in store
              store.dispatch({
                type: "REGISTER_TOKEN",
                client: clientName,
                token: data.sessionToken
              });

              let config = decoded.config.config;
              handleJson.saveJsonFile(config, clientName);
            }
          } catch (err) {
            console.log("Could not reach to server endpoint");
          }
        }

        let clientDoc = handleJson.getJsonFile();
        // Callback Config json file
        callback(clientDoc);

        // Save to state
        this.saveInStore(clientDoc);
      });
    };
  }

  saveInStore = clientDoc => {
    store.dispatch({ type: "CONFIG", config: clientDoc.config });
  };

  jwtSign = () => { };

  request = async (endpoint, token, callback) => {
    try {
      // Make request to website server endpoint
      let request = await axios.get(endpoint, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      // Return request data
      callback(request.data);

    } catch (error) {
      throw error
      callback(false);
    }
  };
}

module.exports = new Api();
