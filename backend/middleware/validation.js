const { check, validationResult } = require('express-validator');

// Validation rules for signup
const validateSignup = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Validation rules for login
const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Validation rules for student data
const validateStudent = [
  check('name', 'Student name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateStudent,
  handleValidationErrors
};
