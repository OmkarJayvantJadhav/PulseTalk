/**
 * Middleware Index
 */

const { authenticate, optionalAuth } = require('./auth');
const { handleValidationErrors, authValidation, analysisValidation } = require('./validate');
const { errorHandler, ApiError } = require('./errorHandler');

module.exports = {
  authenticate,
  optionalAuth,
  handleValidationErrors,
  authValidation,
  analysisValidation,
  errorHandler,
  ApiError
};
