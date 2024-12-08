const jwt = require('jsonwebtoken');

// Middleware to protect routes by checking for a valid token
const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // Return error if no token
    }

    try {
        // Verify JWT using the secret from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodes the token
        req.user = decoded; // Attach decoded user to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' }); // Return error if token is invalid
    }
};

module.exports = protect; // Export the middleware to use it in other files