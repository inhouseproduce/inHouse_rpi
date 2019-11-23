const scheduler = require('./scheduler');
const config = require('./config.json');

let { mainPump, secondPump, lighting } = config.schedule;

const dataLogger = ( name, onoff ) => {
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    console.log('========================')
    console.log(`${name} is ${onoff}`,hour, minutes, seconds)
    console.log('========================')
}

scheduler[mainPump.type](mainPump, { 
    on: () => {
        dataLogger('mainpump', 'on')
    },
        
    off: () => {
        dataLogger('mainpump', 'off')
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
//         dataLogger('lighting', 'on')
//     },
        
//     off: () => {
//         dataLogger('lighting', 'off')
//     }
// });
