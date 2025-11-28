// Mock database for testing
const bcrypt = require('bcrypt');

let users = [];

// Generate a random UUID for testing
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const userRepository = {
  createUser: async (userData) => {
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      const error = new Error('Email already exists');
      error.code = '23505'; // PostgreSQL unique violation code
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      user_id: generateUUID(),
      email: userData.email,
      password: hashedPassword,
      username: userData.username,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    // Map the database field names (snake_case) to API field names (camelCase)
    const { password, ...userWithoutPassword } = newUser;
    return {
      user_id: userWithoutPassword.user_id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      role: userWithoutPassword.role,
      created_at: userWithoutPassword.created_at,
      updated_at: userWithoutPassword.updated_at
    };
  },

  findUserByEmail: async (email) => {
    const user = users.find(user => user.email === email) || null;
    if (user) {
      // Return the full user object with password for authentication
      return {
        user_id: user.user_id,
        email: user.email,
        password: user.password, // This should be the hashed password
        username: user.username,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    }
    return null;
  },

  findUserById: async (userId) => {
    const user = users.find(user => user.user_id === userId) || null;
    if (user) {
      // Return the user object without password for profile endpoints
      return {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    }
    return null;
  },

  updateUser: async (userId, updateData) => {
    const userIndex = users.findIndex(user => user.user_id === userId);
    if (userIndex === -1) {
      return null;
    }

    if (updateData.username) {
      users[userIndex].username = updateData.username;
    }

    if (updateData.password) {
      // Hash the new password
      users[userIndex].password = await bcrypt.hash(updateData.password, 10);
    }

    users[userIndex].updated_at = new Date().toISOString();

    // Map the database field names (snake_case) to API field names (camelCase)
    const updatedUser = { ...users[userIndex] };
    const { password, ...userWithoutPassword } = updatedUser;
    return {
      user_id: userWithoutPassword.user_id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      role: userWithoutPassword.role,
      created_at: userWithoutPassword.created_at,
      updated_at: userWithoutPassword.updated_at
    };
  }
};

module.exports = userRepository;