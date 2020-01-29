module.exports = (app) => {
    app.post('/', (req, res) => {
        console.log('response', res.data)
        res.status(200).json('Response');
    });
};
