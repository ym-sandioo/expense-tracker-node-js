const jsonwebtoken = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
    const accesstoken = req.headers.authorization.replace('Bearer ', '');

    jsonwebtoken.verify(accesstoken, process.env.jwt_secret, (err, user) => {
        if (err) return res.sendStatus(401).json({ status: false, message: "Invalid token" });
        req.user = user;
        next();
    });
    } catch (error) {
        res.status(403).json({ status: false, message: "Unauthorized" });
    }
}

module.exports = auth;