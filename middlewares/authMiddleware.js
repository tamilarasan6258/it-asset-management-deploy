const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authenticate user and attach user to req
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Token error:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// Check for admin role
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// Check for depthead role
exports.isDeptHead = (req, res, next) => {
  if (req.user.role !== 'depthead') {
    return res.status(403).json({ message: 'Department Head access only' });
  }
  next();
};
