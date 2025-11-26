const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';  // 15 minutes
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_default_secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // 7 days

/**
 * Registers a new user
 * @param {Object} userData - User registration data (email, password, username)
 * @returns {Promise<Object>} Created user object
 */
const registerUser = async (userData) => {
  // Check if user already exists
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create the user
  const user = await userRepository.createUser({
    email: userData.email,
    password: hashedPassword,
    username: userData.username
  });
  
  // Remove sensitive information before returning
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Logs in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User object and tokens
 */
const loginUser = async (email, password) => {
  // Find user by email
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate tokens
  const accessToken = jwt.sign(
    { 
      userId: user.user_id, 
      email: user.email, 
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { 
      userId: user.user_id, 
      email: user.email,
      username: user.username,
      role: user.role
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
  
  // Remove password from user object before returning
  const { password: pwd, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
};

/**
 * Refreshes an access token using a refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<Object>} New access token
 */
const refreshToken = async (refreshToken) => {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    
    // Check if user still exists
    const user = await userRepository.findUserById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate a new access token
    const newAccessToken = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email, 
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    return { accessToken: newAccessToken };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};

/**
 * Gets user profile by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User object without password
 */
const getUserProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

/**
 * Updates user profile
 * @param {string} userId - The user ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} Updated user object without password
 */
const updateUserProfile = async (userId, updateData) => {
  // If password is being updated, hash it
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  
  // Update the user
  const updatedUser = await userRepository.updateUser(userId, updateData);
  if (!updatedUser) {
    throw new Error('User not found or no updates made');
  }
  
  return updatedUser;
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
};