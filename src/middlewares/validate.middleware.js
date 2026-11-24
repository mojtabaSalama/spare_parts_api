const ApiError = require('../utils/apiError');

/**
 * Validates req.body against a Joi schema.
 * Usage: validate(partValidator.createPart)
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(ApiError.badRequest('Validation failed', details));
    }

    req.body = value; // sanitized/defaulted payload
    next();
  };
}

module.exports = validate;
