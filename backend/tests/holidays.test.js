const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate a random UUID for testing
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

describe('Holiday API', () => {
  let regularUser;
  let adminUser;
  let regularUserToken;
  let adminUserToken;
  
  beforeAll(async () => {
    // Generate JWT tokens for testing
    const tokenSecret = process.env.JWT_SECRET || 'default_secret';
    
    regularUser = {
      userId: generateUUID(),
      email: 'regular@example.com',
      username: 'Regular User',
      role: 'user'
    };
    
    adminUser = {
      userId: generateUUID(),
      email: 'admin@example.com',
      username: 'Admin User',
      role: 'admin'
    };
    
    // Create tokens with valid structure
    regularUserToken = jwt.sign(
      { 
        userId: regularUser.userId, 
        email: regularUser.email, 
        username: regularUser.username,
        role: regularUser.role 
      },
      tokenSecret,
      { expiresIn: '15m' }
    );
    
    adminUserToken = jwt.sign(
      { 
        userId: adminUser.userId, 
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role
      },
      tokenSecret,
      { expiresIn: '15m' }
    );
  });

  describe('GET /api/holidays', () => {
    test('should get list of holidays successfully for regular user', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should get list of holidays successfully for admin user', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter holidays by year', async () => {
      const response = await request(app)
        .get('/api/holidays?year=2025')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter holidays by month', async () => {
      const response = await request(app)
        .get('/api/holidays?month=1')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/holidays', () => {
    test('should create a new holiday successfully for admin user', async () => {
      const newHoliday = {
        title: 'Test Holiday',
        date: '2025-12-25',
        description: 'A test holiday for testing purposes',
        isRecurring: true
      };

      const response = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(newHoliday)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('holidayId');
      expect(response.body.data.title).toBe(newHoliday.title);
      expect(response.body.data.date).toBe(newHoliday.date);
    });

    test('should return 403 for regular user trying to create holiday', async () => {
      const newHoliday = {
        title: 'Unauthorized Holiday',
        date: '2025-12-26',
        description: 'This should not be created',
        isRecurring: true
      };

      const response = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(newHoliday)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    test('should return error for invalid holiday data', async () => {
      const invalidHoliday = {
        // Missing required title
        date: '2025-12-27',
        description: 'Holiday without title'
      };

      const response = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(invalidHoliday)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/holidays/:id', () => {
    test('should update a holiday successfully for admin user', async () => {
      // First, create a holiday to update
      const newHoliday = {
        title: 'Holiday to Update',
        date: '2025-11-30',
        description: 'Original description',
        isRecurring: true
      };

      const createResponse = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(newHoliday)
        .expect(201);

      const holidayId = createResponse.body.data.holidayId;

      // Now update the holiday
      const updateData = {
        title: 'Updated Holiday',
        description: 'Updated description',
        date: '2025-11-30'
      };

      const response = await request(app)
        .put(`/api/holidays/${holidayId}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });

    test('should return 403 for regular user trying to update holiday', async () => {
      // First, create a holiday to update
      const newHoliday = {
        title: 'Holiday to Update by Regular',
        date: '2025-11-29',
        description: 'Original description',
        isRecurring: true
      };

      const createResponse = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(newHoliday)
        .expect(201);

      const holidayId = createResponse.body.data.holidayId;

      // Now try to update as regular user
      const updateData = {
        title: 'Updated by Regular User',
        description: 'This should fail',
        date: '2025-11-29'
      };

      const response = await request(app)
        .put(`/api/holidays/${holidayId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    test('should return 404 for non-existent holiday', async () => {
      const updateData = {
        title: 'Non-existent Holiday',
        description: 'Trying to update non-existent holiday',
        date: '2025-11-29'
      };

      const response = await request(app)
        .put(`/api/holidays/${generateUUID()}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('HOLIDAY_NOT_FOUND');
    });
  });
});