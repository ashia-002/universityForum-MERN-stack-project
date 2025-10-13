const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authentication = (req, res, next) => {
    const token = req.cookies?.token || 
        (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')
            ? req.headers['authorization'].split(' ')[1]
            : null);

    if (!token) {
        return res.status(401).json({
            message: 'No token provided, authentication denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // ✅ critical
    } catch (error) {
        return res.status(401).json({
            msg: 'Token is not valid'
        });
    }
};
