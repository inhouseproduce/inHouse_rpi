const GPIO = require('rpio');

// set the pin numbers here of what we want to test
let pin = [
    33, 35, 37
];

console.log('pin', pin.length);

// set all the pins to HIGH to begin with
for (i = 0; i < pin.length; i++) {
    console.log("Setting", pin[i]);
    GPIO.open(pin[i], GPIO.OUTPUT, GPIO['HIGH']);
}

// continuously run this code
setInterval(() => {
    // Set all the pins high
    for (i = 0; i < pin.length; i++) {
        console.log("Highing", pin[i]);
        GPIO.write(pin[index], GPIO['HIGH']);
    }
    // set it to LOW now
    setTimeout(() => {
        for (i = 0; i < pin.length; i++) {
            console.log("Lowering", pin[i]);
            GPIO.write(pin[i], GPIO['LOW']);
        }
    }, 5000);
}, 10000);