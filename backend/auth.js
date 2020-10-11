const jwt = require("jsonwebtoken");
const jwtSecret = require("./config/jwtSecret");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(token, jwtSecret);
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "JWT Authentification Failed"
        });
    }
};