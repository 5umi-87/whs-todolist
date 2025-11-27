const request = require('supertest');
const app = require('../src/app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock repository for testing
let todos = [];
let users = [];

// Generate a random UUID for testing
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

describe('Todo API', () => {
  let testUser;
  let authToken;
  let otherUser;
  let otherUserToken;
  let sampleTodo;

  beforeAll(async () => {
    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    testUser = {
      userId: generateUUID(),
      email: 'testuser@example.com',
      password: hashedPassword,
      username: 'Test User',
      role: 'user'
    };
    
    otherUser = {
      userId: generateUUID(),
      email: 'otheruser@example.com',
      password: hashedPassword,
      username: 'Other User',
      role: 'user'
    };
    
    users = [testUser, otherUser];
    
    // Generate JWT tokens for testing
    const tokenSecret = process.env.JWT_SECRET || 'default_secret';
    
    authToken = jwt.sign(
      { 
        userId: testUser.userId, 
        email: testUser.email, 
        username: testUser.username,
        role: testUser.role 
      },
      tokenSecret,
      { expiresIn: '15m' }
    );
    
    otherUserToken = jwt.sign(
      { 
        userId: otherUser.userId, 
        email: otherUser.email,
        username: otherUser.username,
        role: otherUser.role
      },
      tokenSecret,
      { expiresIn: '15m' }
    );
  });

  beforeEach(() => {
    // Reset todos for each test
    todos = [];
    
    // Create a sample todo for testing
    sampleTodo = {
      todoId: generateUUID(),
      userId: testUser.userId,
      title: 'Test Todo',
      content: 'Test content',
      startDate: '2025-01-01',
      dueDate: '2025-12-31',
      status: 'active',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  describe('POST /api/todos', () => {
    test('should create a new todo successfully', async () => {
      const newTodo = {
        title: 'New Todo',
        content: 'New content',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('todoId');
      expect(response.body.data.title).toBe(newTodo.title);
      expect(response.body.data.content).toBe(newTodo.content);
      expect(response.body.data.status).toBe('active');
      expect(response.body.data.isCompleted).toBe(false);
    });

    test('should return error for missing title', async () => {
      const invalidTodo = {
        content: 'New content',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodo)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should return error for invalid date range (dueDate < startDate)', async () => {
      const invalidTodo = {
        title: 'Invalid Todo',
        content: 'New content',
        startDate: '2025-12-31',
        dueDate: '2025-01-01'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodo)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    test('should get user\'s todos successfully', async () => {
      // Add sample todos
      todos.push(sampleTodo);
      const otherTodo = { ...sampleTodo, todoId: generateUUID(), userId: otherUser.userId };
      todos.push(otherTodo);

      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].todoId).toBe(sampleTodo.todoId);
    });

    test('should filter todos by status', async () => {
      const completedTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        status: 'completed'
      };
      
      const deletedTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        status: 'deleted'
      };
      
      todos.push(sampleTodo, completedTodo, deletedTodo);

      const response = await request(app)
        .get('/api/todos?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('completed');
    });
  });

  describe('GET /api/todos/:id', () => {
    test('should get a single todo successfully', async () => {
      todos.push(sampleTodo);

      const response = await request(app)
        .get(`/api/todos/${sampleTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.todoId).toBe(sampleTodo.todoId);
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${generateUUID()}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should return 403 when accessing another user\'s todo', async () => {
      const otherUserTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        userId: otherUser.userId
      };
      todos.push(otherUserTodo);

      const response = await request(app)
        .get(`/api/todos/${otherUserTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/todos/:id', () => {
    test('should update a todo successfully', async () => {
      todos.push(sampleTodo);
      
      const updateData = {
        title: 'Updated Todo',
        content: 'Updated content',
        startDate: '2025-02-01',
        dueDate: '2025-11-30'
      };

      const response = await request(app)
        .put(`/api/todos/${sampleTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);
    });

    test('should return 403 when updating another user\'s todo', async () => {
      const otherUserTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        userId: otherUser.userId
      };
      todos.push(otherUserTodo);

      const updateData = {
        title: 'Updated Todo',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/todos/${otherUserTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('should return error for invalid date range', async () => {
      todos.push(sampleTodo);
      
      const invalidUpdate = {
        title: 'Updated Todo',
        dueDate: '2024-01-01', // before startDate
        startDate: '2025-01-01'
      };

      const response = await request(app)
        .put(`/api/todos/${sampleTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('should soft delete a todo successfully', async () => {
      todos.push(sampleTodo);

      const response = await request(app)
        .delete(`/api/todos/${sampleTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('deleted');
      expect(response.body.data).toHaveProperty('deletedAt');
    });

    test('should return 403 when deleting another user\'s todo', async () => {
      const otherUserTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        userId: otherUser.userId
      };
      todos.push(otherUserTodo);

      const response = await request(app)
        .delete(`/api/todos/${otherUserTodo.todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    test('should mark todo as complete successfully', async () => {
      todos.push(sampleTodo);

      const response = await request(app)
        .patch(`/api/todos/${sampleTodo.todoId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.isCompleted).toBe(true);
    });

    test('should return 403 when completing another user\'s todo', async () => {
      const otherUserTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        userId: otherUser.userId
      };
      todos.push(otherUserTodo);

      const response = await request(app)
        .patch(`/api/todos/${otherUserTodo.todoId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/todos/:id/restore', () => {
    test('should restore a deleted todo successfully', async () => {
      const deletedTodo = {
        ...sampleTodo,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      };
      todos.push(deletedTodo);

      const response = await request(app)
        .patch(`/api/todos/${deletedTodo.todoId}/restore`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('active');
      expect(response.body.data.deletedAt).toBeNull();
    });

    test('should return 403 when restoring another user\'s todo', async () => {
      const deletedOtherTodo = {
        ...sampleTodo,
        todoId: generateUUID(),
        userId: otherUser.userId,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      };
      todos.push(deletedOtherTodo);

      const response = await request(app)
        .patch(`/api/todos/${deletedOtherTodo.todoId}/restore`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});