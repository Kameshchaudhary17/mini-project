import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Use the same secret for signing and verifying
const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key_12345';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the correct secretKey
    const decoded = jwt.verify(token, secretKey); // Use 'secretKey' here
    req.user = decoded; // Attach decoded token payload to req.user
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  // Check if the user has admin privileges
  if (req.user && req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};
