const jwt = require("jsonwebtoken");
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;


function adminMiddleware(req, res, next) {
    const token = req.headers.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
        req.id = decoded.id;
        next()
    } catch (error) {
        res.status(403).json({
            message: "Invalid Token"
        })
    }

}

module.exports = {
    adminMiddleware: adminMiddleware
}