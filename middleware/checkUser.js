const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, authorization denied." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }
        req.user = decoded.userId; // Store user ID from token in request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = checkAuth;
