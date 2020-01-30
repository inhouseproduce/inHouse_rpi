module.exports = (app, store) => {
    app.post('/', (req, res) => {
        console.log('response', res.data)
        res.status(200).json('Response');
    });
};
