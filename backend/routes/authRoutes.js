const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin, handleValidationErrors } = require('../middleware/validation');

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);

module.exports = router;
