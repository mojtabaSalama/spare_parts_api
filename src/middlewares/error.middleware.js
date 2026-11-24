const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

/**
 * Catches 404s for any route not matched above this middleware.
 */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Centralized error handler. Must be registered LAST, after all routes.
 * Express recognizes this as an error handler because it takes 4 arguments.
 */
function errorHandler(err, req, res, next) {
  let { statusCode, message, errors } = err;

  // Handle Sequelize-specific errors that aren't already ApiError instances
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with this value already exists';
    errors = err.errors?.map((e) => e.message);
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors?.map((e) => e.message);
  }

  if (!statusCode) {
    statusCode = 500;
    message = message || 'Internal server error';
  }

  // Log unexpected (non-operational) errors with full stack for debugging
  if (!(err instanceof ApiError) || statusCode >= 500) {
    logger.error(err.stack || err.message);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };
