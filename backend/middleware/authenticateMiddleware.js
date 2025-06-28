const { verifyToken } = require('./jwt'); // Utility to verify JWT tokens

// Middleware to check if a user is authenticated via a valid JWT token
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Authentication Header: ${authHeader}`);

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(`Token extracted: ${token}`);

        try {
            const user = verifyToken(token);  // Verify JWT and get user payload
            req.user = user; // Attach user info to request for further use
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ error: "Invalid or expired token." });
        }
    } else {
        console.log("Authentication Header: undefined");
        res.status(401).json({ error: "Authorization header missing or malformed." });
    }
};

// Middleware factory to check if authenticated user has required role
const isAuthorized = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ error: "User not authenticated." });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Insufficient permissions. Required: ${requiredRole}` });
        }

        next(); // User has required role, continue processing
    };
};

module.exports = { isAuthenticated, isAuthorized };
