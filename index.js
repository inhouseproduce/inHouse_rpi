const scheduler = require('./scheduler');
const config = require('./config.json');

let { mainPump, secondPump, lighting } = config.schedule;
let date = new Date()
console.log('starting ---:', date.getHours(),date.getMinutes())

scheduler[mainPump.type](mainPump, { 
    on: () => {
        console.log('Main Pump is on :', new Date().getMinutes(), new Date().getSeconds())
    },
        
    off: () => {
        console.log('Main Pump is off :', new Date().getMinutes(), new Date().getSeconds())
    }
});


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
//         console.log('Lighting is on :', new Date().getMinutes())
//     },
        
//     off: () => {
//         console.log('Lighting is off :', new Date().getMinutes())
//     },

//     dim: () => {
//         console.log('Light is dimming', new Date().getMinutes())
//     }
// });
