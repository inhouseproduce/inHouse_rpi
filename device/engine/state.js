const moment = require('moment');

class State {
    constructor() {
        this.catch = (nextDates, job) => {
            let states = nextDates.map((action, i) => {
                // Initialize next job
                let next = nextDates[i + 1];

                // If next in array ( stops at the last index )
                if (next) {
                    let nextJob = next.job;
                    let currentJob = action.job;

                    // Check if current time is in between of two consecutive indexes of nextDates array
                    let isBtw = this.isBetween(currentJob.time, nextJob.time);
                    if (isBtw) {
                        // if is in between run current job return true for checker
                        job(currentJob);
                        return true;
                    };
                };
                return false;
            });
            // Catch the state 
            this.catchState(states, nextDates, job);
        };
    };

    catchState(states, nextDates, job) {
        // if nothing was inBetween run last index of an array 
        let checker = {};

        // Set states in checker object
        for (let i in states) {
            checker[states[i]] = states[i];
        };

        // Check if checker object has true state, else run last index
        if (!checker.true) {
            let lastIndex = nextDates.length - 1;
            job(nextDates[lastIndex].job);
        };
    }

    isBetween(first, second) {
        //compare current time, is between of first and second
        let currentTime = moment();
        let { one, two } = timeFormat();
        return currentTime.isBetween(one, two);

        // Format two time values with moment
        function timeFormat() {
            let one = moment(first, dateFormat(first));
            let two = moment(second, dateFormat(second));
            return { one, two };
        };

        // Format datastapm
        function dateFormat(date) {
            let length = date.split(':').length;
            if (length === 1) return 'HH';
            else if (length === 2) return 'HH:mm';
            else if (length === 3) return 'HH:mm:ss';
        };
    };
};

module.exports = new State;