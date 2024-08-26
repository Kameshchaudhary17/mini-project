import jwt from 'jsonwebtoken';

// Environment variable for JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token is missing or invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    req.user = user; // Attach user info to request object
    next();
  });
};


export const authorizeRole = (roles) => (req, res, next) => {
    const userRole = req.user?.role;
  
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  
    next();
  };