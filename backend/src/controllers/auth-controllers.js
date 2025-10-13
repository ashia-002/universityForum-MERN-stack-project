const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const user = require('../models/user.js')
const Department = require('../models/department.js')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;

    // Validate email domain
    if (!email.endsWith('@rpsu.edu.bd')) {
      return res.status(400).json({ message: 'Only university emails (rpsu.edu.bd) are allowed.' });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      user_id: `U-${Date.now()}`,
      name,
      email,
      password,
      role,
      department_id
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({
            message: 'User not registered'
        });

        const validPassward = await bcrypt.compare(password, user.password);
        if(!validPassward) return res.status(400).json({
            message: 'Invalid Password'
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

            // Set the token in a cookie with dynamic `secure` based on the environment
            res.cookie("token", token, {
                httpOnly: false,  // Ensures the cookie is not accessible via JavaScript
                secure: process.env.NODE_ENV === "production",  // Use `secure: true` in production (HTTPS)
                sameSite: "Strict",  // Ensures the cookie is only sent in requests from the same origin
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

        res.json({
            message: 'Login Successful',
            token,
            user: {
                name: user.name,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message,
        })
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'strict',
    });
    res.status(200).json({
        message: 'Logged out successfully'
    });
}