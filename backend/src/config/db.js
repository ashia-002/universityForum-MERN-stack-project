const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGO_URL;

const connectDb = async() => {
    try {
        await mongoose.connect(URI);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Database connection error'
        })
    }
}

module.exports = connectDb;