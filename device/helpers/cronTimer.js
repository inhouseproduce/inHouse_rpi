class Timer {
    constructor(){
        this.interval = config => {
            return `0 */${config.time_interval} * * * *`;
        };

        this.clock = job => {
            let { hour, minute, second } = this.timeParser(job.time);
            return `${second} ${minute} ${hour} * * *`;
        };
    };

    timeParser(data) {
        let time = data.split(':');
        return {
            hour: time[0],
            minute: time[1] ? time[1] : '00',
            second: time[2] ? time[2] : '00'
        };
    };
};

module.exports = new Timer;
