const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication API', () => {
  // Test data
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'Test User'
  };
  
  const updatedUserData = {
    username: 'Updated User',
    password: 'newpassword123'
  };

  // Clean up after each test
  afterEach(async () => {
    // In a real implementation, you would clean up test data here
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.role).toBe('user');
      // Verify password is not returned in response
      expect(response.body.data).not.toHaveProperty('password');
    });

    test('should return error for duplicate email', async () => {
      // Register the same user again
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
        
      expect(response.body.success).toBe(false);
    });

    test('should return error for invalid email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    test('should return error for short password', async () => {
      const shortPasswordUser = { ...testUser, password: '123' };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(shortPasswordUser)
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });

    test('should return error when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);
        
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    // Register a user first before login tests
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('should login user and return JWT tokens', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      
      // Verify that password is not returned
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    test('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should return error for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should refresh access token with valid refresh token', async () => {
      // First, login to get tokens
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const refreshToken = loginResponse.body.data.refreshToken;
      
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.accessToken).not.toBe(loginResponse.body.data.accessToken);
    });

    test('should return error for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/me', () => {
    let accessToken;

    beforeAll(async () => {
      // Login to get access token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      accessToken = loginResponse.body.data.accessToken;
    });

    test('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.data.role).toBe('user');
    });

    test('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should return error without token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/users/me', () => {
    let accessToken;

    beforeAll(async () => {
      // Login to get access token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      accessToken = loginResponse.body.data.accessToken;
    });

    test('should update user profile with valid token', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: updatedUserData.username,
          password: updatedUserData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(updatedUserData.username);
    });

    test('should update user profile with only username', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: 'Updated Again'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('Updated Again');
    });

    test('should return error with invalid token', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .send({ username: 'New Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should return error without token', async () => {
      const response = await request(app)
        .patch('/api/users/me')
        .send({ username: 'New Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});