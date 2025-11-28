// config/database.js
const { Pool } = require('pg');

let pool;

// Check if we're in test mode or if a specific environment variable is set to use mocked data instead of real database
if (process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true') {
  // Export mock repository methods for test environment or when USE_MOCK_DB is set to true
  const mockRepository = require('../repositories/userRepository.mock');
  module.exports = mockRepository;
} else {
  // Use real database connection for development and production
  const { Pool } = require('pg');

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // RLS 세션 변수 설정 헬퍼 함수
  const setRLSContext = async (client, userId) => {
    if (userId) {
      await client.query(`SET LOCAL app.current_user_id = '${userId}'`);
    }
  };

  // RLS를 우회하여 쿼리 실행 (회원가입, 로그인 등 인증 전 작업용)
  const queryWithoutRLS = async (query, params) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // RLS를 우회하기 위해 세션 변수를 빈 문자열로 설정하지 않고 BYPASSRLS 또는 정책 수정 필요
      // 대신 직접 쿼리 실행 (테이블 소유자 권한으로 실행됨)
      const result = await client.query(query, params);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  // RLS 컨텍스트를 설정하고 쿼리 실행
  const queryWithRLS = async (userId, query, params) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await setRLSContext(client, userId);
      const result = await client.query(query, params);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  module.exports = {
    createUser: async (userData) => {
      const { email, password, username } = userData;

      const query = `
        INSERT INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, username, role, created_at, updated_at
      `;

      try {
        const result = await queryWithoutRLS(query, [email, password, username]);
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

      const result = await queryWithoutRLS(query, [email]);
      return result.rows[0] || null;
    },

    findUserById: async (userId) => {
      const query = `
        SELECT user_id, email, username, role, created_at, updated_at
        FROM users
        WHERE user_id = $1
      `;

      const result = await queryWithRLS(userId, query, [userId]);
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
        const result = await queryWithRLS(userId, query, values);
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