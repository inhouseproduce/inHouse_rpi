const scheduler = require('./scheduler');
let { mainPump, secondPump, lighting } = require('./config.json');


scheduler[mainPump.type](mainPump, { 
    on: () => {
        console.log('main pump is on ')
    },
        
    off: () => {
        console.log('main pump is off ')
    }
});


scheduler[secondPump.type](secondPump, { 
    on: () => {
        console.log('secondery pump is on ')
    },
        
    off: () => {
        console.log('secondery pump is off ')
    }
});


scheduler[lighting.type](lighting, { 
    on: () => {
        console.log('lighting  is on ')
    },
        
    off: () => {
        console.log('lighting  is off ')
    }
});


