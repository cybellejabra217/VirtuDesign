// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken'); // Import JWT library for token verification
const userService = require('../services/userService'); // Import user service to fetch user data

// Middleware function to require admin access
module.exports = async function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization']; // Get Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from header

  if (!token) {
    // If token is missing, respond with Unauthorized status
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the JWT token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user details based on userId from token
    const user = await userService.findByUserId(decoded.userId);

    if (!user) {
      // If user does not exist, respond with Unauthorized status
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (!user.IsAdmin) {
      // If user is not an admin, respond with Forbidden status
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    req.user = user; // Attach user info to the request object for downstream use
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    // If token verification fails, respond with Forbidden status
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
