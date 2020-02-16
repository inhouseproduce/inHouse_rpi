const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Verifies Client Session Token 
module.exports = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        try {
            const token = req.headers['authorization'].split('Bearer')[1].trim();
            let decoded = await jwt.verify(token, 'secret');

            let hasheduuid = decoded.uuid;
            let plainuuid = process.env.BALENA_DEVICE_UUID;

            bcrypt.compare(plainuuid, hasheduuid, async (err, match) => {
                if (match) next();
            });
        } catch (error) {
            res.status(401).end();
        };
    } else {
        res.status(401).end();
    };
};