/**
 * Validation Middleware
 */

const { validationResult, body, param, query } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * Auth validation rules
 */
const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase, lowercase, and number'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    handleValidationErrors
  ],

  login: [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ]
};

/**
 * Analysis validation rules
 */
const analysisValidation = {
  create: [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('Text is required')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Text must be between 1 and 5000 characters'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('tags')
      .optional()
      .isArray({ max: 10 })
      .withMessage('Tags must be an array with maximum 10 items'),
    handleValidationErrors
  ],

  batch: [
    body('texts')
      .isArray({ min: 1, max: 100 })
      .withMessage('Texts must be an array with 1-100 items'),
    body('texts.*')
      .trim()
      .notEmpty()
      .withMessage('Each text must not be empty')
      .isLength({ max: 5000 })
      .withMessage('Each text cannot exceed 5000 characters'),
    handleValidationErrors
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid analysis ID'),
    handleValidationErrors
  ],

  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sentiment')
      .optional()
      .isIn(['positive', 'negative', 'neutral'])
      .withMessage('Invalid sentiment filter'),
    handleValidationErrors
  ],

  export: [
    param('id')
      .isMongoId()
      .withMessage('Invalid analysis ID'),
    query('format')
      .optional()
      .isIn(['json', 'csv'])
      .withMessage('Format must be json or csv'),
    handleValidationErrors
  ],

  createFromUrl: [
    body('url')
      .trim()
      .notEmpty()
      .withMessage('URL is required')
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Please enter a valid URL'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  authValidation,
  analysisValidation
};
