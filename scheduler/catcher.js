const moment = require('moment');

class Catcher {
    constructor(){
        this.state = (nextDates , job) => {
            nextDates.map((date, i) => {
                // Get current time
                const currentTime = moment();

                let nextAction = nextDates[i+1];
                if( nextAction )
                    {
                        // Current map object
                        let time = date.job.time;
                        // Next map object
                        let nextTime = nextAction.job.time;

                        // format next and current object 
                        const first = moment(time, dateFormat(time));
                        const second = moment(nextTime, dateFormat(nextTime));
                        
                        // Compare current and next action objects
                        let isBetween = currentTime.isBetween(first, second);

                        // If is between current and next object (times) run the job
                        if( isBetween ) job(date.job);//passing current job as argument
                    }
            });
            
            function dateFormat(date){
                let length = date.split(':').length;
                if( length === 1 ){
                    return 'HH a'
                } 
                else if( length === 2) {
                    return 'HH:mm a'
                } 
                else if ( length === 3 ){
                    return 'HH:mm:ss a'
                }
            };
        };
    };
};

module.exports = new Catcher;