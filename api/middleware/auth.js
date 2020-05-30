const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.jwt_private_key);
        req.userData = decoded;
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            status: 'NOK'
        })
    }
    next();
}
