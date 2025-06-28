const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Generate JWT token with user data payload
const generateToken = (userData) => {
    const payload = {
        userId: userData.userId,      // User ID
        username: userData.username,  // Username included in token
        joinDate: userData.joinDate,  // User join date included
    };
    // Sign token with secret and expiration
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token and return decoded payload
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') throw new Error('Token has expired');
        else if (error.name === 'JsonWebTokenError') throw new Error('Token is invalid');
        else throw new Error('Invalid or expired token');
    }
};

module.exports = { generateToken, verifyToken };
