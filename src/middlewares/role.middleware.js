const ApiError = require('../utils/apiError');

/**
 * Restricts a route to specific roles.
 * Usage: authorizeRoles('admin') or authorizeRoles('admin', 'staff')
 * Must run AFTER verifyToken, since it relies on req.user.
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = { authorizeRoles };
