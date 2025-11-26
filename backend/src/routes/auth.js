const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  refresh, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username is required')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
];

// Validation rules for token refresh
const refreshValidation = [
  body('refreshToken')
    .exists()
    .withMessage('Refresh token is required')
];

// Validation rules for profile update
const profileUpdateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username must be at least 1 character long'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Register route - Public
router.post('/auth/register', registerValidation, register);

// Login route - Public
router.post('/auth/login', loginValidation, login);

// Refresh token route - Public (token is in request body, not header)
router.post('/auth/refresh', refreshValidation, refresh);

// Logout route - Protected
router.post('/auth/logout', auth, (req, res) => {
  // In a real implementation, you would invalidate the refresh token
  // For now, just return a success response
  res.status(200).json({
    success: true,
    message: '로그아웃 되었습니다'
  });
});

// Get current user profile - Protected
router.get('/users/me', auth, getProfile);

// Update current user profile - Protected
router.patch('/users/me', auth, profileUpdateValidation, updateProfile);

module.exports = router;