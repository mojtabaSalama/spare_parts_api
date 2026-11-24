const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

/**
 * Verifies the JWT [REDACTED_SECRET] sent in the Authorization header.
 * On success, attaches the decoded payload to req.user.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return next(ApiError.unauthorized('No token provided'));
  }

  jwt.verify(token, env.jwt.secret, (err, decoded) => {
    if (err) {
      return next(ApiError.forbidden('Invalid or expired token'));
    }
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
}

module.exports = { verifyToken, requireAdmin };