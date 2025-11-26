const authService = require('../services/authService');
const { validationResult } = require('express-validator');

/**
 * Controller for user registration
 */
const register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    
    const { email, password, username } = req.body;
    
    // Register the user
    const user = await authService.registerUser({
      email,
      password,
      username
    });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already exists'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Registration failed'
      }
    });
  }
};

/**
 * Controller for user login
 */
const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    
    const { email, password } = req.body;
    
    // Login the user
    const result = await authService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Login failed'
      }
    });
  }
};

/**
 * Controller for token refresh
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Refresh token is required'
        }
      });
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Refresh token expired' || error.message === 'Invalid refresh token') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error.message
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'REFRESH_ERROR',
        message: 'Token refresh failed'
      }
    });
  }
};

/**
 * Controller for getting current user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware
    
    const user = await authService.getUserProfile(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_ERROR',
        message: 'Failed to retrieve user profile'
      }
    });
  }
};

/**
 * Controller for updating current user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware
    const { username, password } = req.body;
    
    // Validate input - at least one field must be provided
    if (!username && !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least one field (username or password) must be provided'
        }
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;
    
    const updatedUser = await authService.updateUserProfile(userId, updateData);
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    if (error.message === 'User not found or no updates made') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or no updates made'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update user profile'
      }
    });
  }
};

module.exports = {
  register,
  login,
  refresh,
  getProfile,
  updateProfile,
};