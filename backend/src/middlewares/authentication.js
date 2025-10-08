const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authentication = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({
        message: 'No token provided, authentication denied'
    })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            msg: 'Token is not valid'
        });
    }
}