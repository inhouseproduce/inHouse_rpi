const scheduler = require('./scheduler');
const config = require('./config.json');
// const CronJob = require('cron').CronJob;
// const GPIO = require('gpio');

//let { mainPump, secondPump, lighting } = config.schedule;

// const dataLogger = ( name, onoff ) => {
//     let hour = new Date().getHours();
//     let minutes = new Date().getMinutes();
//     let seconds = new Date().getSeconds();

//     console.log('========================')
//     console.log(`${name} is ${onoff}`,hour, minutes, seconds)
//     console.log('========================')
// }

// scheduler[mainPump.type](mainPump, { 
//     on: () => {
//         dataLogger('mainpump', 'on')
//     },
        
//     off: () => {
//         dataLogger('mainpump', 'off')
//     }
// });


// scheduler[secondPump.type](secondPump, { 
//     on: () => {
//         console.log('secondery pump is on ')
//     },
        
//     off: () => {
//         console.log('secondery pump is off ')
//     }
// });


// scheduler[lighting.type](lighting, { 
//     on: () => {
//         dataLogger('lighting', 'on')
//     },
        
//     off: () => {
//         dataLogger('lighting', 'off')
//     }
// });

console.log('code is ready')

const CronJob = require('cron').CronJob;
const GPIO = require('gpio');

let gpio = GPIO.export(22, {
    direction: GPIO.DIRECTION.OUT,
});

new CronJob(`0 */1 * * * *`, () => {
    console.log('off')
    gpio.set(0);
    setTimeout(() => { 
        console.log('on')
        gpio.set()
    }, 30000);
}).start();

