// Mock database for testing
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

    const newUser = {
      user_id: generateUUID(),
      email: userData.email,
      password: userData.password, // In real implementation, this would be hashed
      username: userData.username,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    // Map the database field names (snake_case) to API field names (camelCase)
    const { password, ...userWithoutPassword } = newUser;
    return {
      userId: userWithoutPassword.user_id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      role: userWithoutPassword.role,
      createdAt: userWithoutPassword.created_at,
      updatedAt: userWithoutPassword.updated_at
    };
  },

  findUserByEmail: async (email) => {
    const user = users.find(user => user.email === email) || null;
    if (user) {
      // Map the database field names (snake_case) to API field names (camelCase)
      return {
        userId: user.user_id,
        email: user.email,
        password: user.password,
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
      // Map the database field names (snake_case) to API field names (camelCase)
      return {
        userId: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
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
      users[userIndex].password = updateData.password; // In real implementation, this would be hashed
    }

    users[userIndex].updated_at = new Date().toISOString();

    // Map the database field names (snake_case) to API field names (camelCase)
    const updatedUser = { ...users[userIndex] };
    const { password, ...userWithoutPassword } = updatedUser;
    return {
      userId: userWithoutPassword.user_id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      role: userWithoutPassword.role,
      createdAt: userWithoutPassword.created_at,
      updatedAt: userWithoutPassword.updated_at
    };
  }
};

module.exports = userRepository;