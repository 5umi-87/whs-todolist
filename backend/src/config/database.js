// config/database.js
const { Pool } = require('pg');

let pool;

// Check if we're in test mode to use mocked data instead of real database
if (process.env.NODE_ENV === 'test') {
  // Export mock repository methods for test environment
  const mockRepository = require('../repositories/userRepository.mock');
  module.exports = mockRepository;
} else {
  // Use real database connection for development and production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  module.exports = {
    createUser: async (userData) => {
      const { email, password, username } = userData;
      
      const query = `
        INSERT INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, username, role, created_at, updated_at
      `;
      
      try {
        const result = await pool.query(query, [email, password, username]);
        return result.rows[0];
      } catch (error) {
        // Check if it's a unique constraint violation (duplicate email)
        if (error.code === '23505') {
          throw new Error('Email already exists');
        }
        throw error;
      }
    },

    findUserByEmail: async (email) => {
      const query = `
        SELECT user_id, email, password, username, role, created_at, updated_at
        FROM users
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    },

    findUserById: async (userId) => {
      const query = `
        SELECT user_id, email, username, role, created_at, updated_at
        FROM users
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    },

    updateUser: async (userId, updateData) => {
      const { username, password } = updateData;
      
      // Build dynamic query based on what fields are being updated
      const setFields = [];
      const values = [userId];
      let valueIndex = 2;
      
      if (username !== undefined) {
        setFields.push(`username = $${valueIndex}`);
        values.push(username);
        valueIndex++;
      }
      
      if (password !== undefined) {
        setFields.push(`password = $${valueIndex}`);
        values.push(password);
        valueIndex++;
      }
      
      // Update the updated_at timestamp
      setFields.push(`updated_at = NOW()`);
      
      if (setFields.length === 1) { // Only updated_at was set
        return null; // Nothing to update
      }
      
      const query = `
        UPDATE users
        SET ${setFields.join(', ')}
        WHERE user_id = $1
        RETURNING user_id, email, username, role, created_at, updated_at
      `;
      
      try {
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        // Check if it's a unique constraint violation (duplicate email if email was being updated)
        if (error.code === '23505') {
          throw new Error('Email already exists');
        }
        throw error;
      }
    },
  };
}