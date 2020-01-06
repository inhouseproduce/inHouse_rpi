const scheduler = require('./scheduler');

console.log('hour', new Date().getHours(), 'minue', new Date().getMinutes());

module.exports = (config) => {
    let { mainPump, secondPump, lighting, camera } = config.schedule;

    scheduler[mainPump.type](mainPump, {
        on: () => {
            console.log('Main Pump is on :', new Date().getMinutes(), new Date().getSeconds())
        },

        off: () => {
            console.log('Main Pump is off :', new Date().getMinutes(), new Date().getSeconds())
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
            console.log('Lighting is on :', new Date().getMinutes())
        },

        off: () => {
            console.log('Lighting is off :', new Date().getMinutes())
        },

        dim: () => {
            console.log('Light is dimming', new Date().getMinutes())
        }
    });

    scheduler[camera.type](camera, {
        capture:()=>{
            console.log('caputring image')
        }
    })
}