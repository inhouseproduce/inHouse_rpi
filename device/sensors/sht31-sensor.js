const SHT31 = require('raspi-node-sht31');
const sht31 = new SHT31();
 
// Read temperature and display in console in F with Relative humidity
sht31.readSensorData().then((data) => {
  // Temp in Fahrenheit -- If you get floating point rouding errors, multiply by ten before rouding, divide by 10 after.
  const temp = Math.round(data.temperature * 1.8 + 32);
  const humidity = Math.round(data.humidity);
 
  console.log(`The temperature is: ${temp} degress F\nThe Humidity is: ${humidity}%`);
 
}).catch(console.log);