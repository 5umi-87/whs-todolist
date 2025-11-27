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

describe('Trash API', () => {
  let testUser;
  let authToken;
  let otherUser;
  let otherUserToken;
  let activeTodo;
  let deletedTodo;
  let otherUserDeletedTodo;

  beforeAll(async () => {
    // Generate JWT tokens for testing
    const tokenSecret = process.env.JWT_SECRET || 'default_secret';
    
    testUser = {
      userId: generateUUID(),
      email: 'testuser@example.com',
      username: 'Test User',
      role: 'user'
    };
    
    otherUser = {
      userId: generateUUID(),
      email: 'otheruser@example.com',
      username: 'Other User',
      role: 'user'
    };
    
    // Create tokens with valid structure
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
    // Note: In a real test environment with database, we would set up test data here
    // For this mock-based test, we rely on the API to create and manipulate data
  });

  describe('GET /api/trash', () => {
    test('should get user\'s deleted todos successfully', async () => {
      // First, create a todo and then delete it to have a deleted todo
      const newTodo = {
        title: 'Test Todo for Trash',
        content: 'This will be deleted',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      // Create a todo
      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201);
      
      const todoId = createResponse.body.data.todoId;

      // Delete the todo to put it in trash
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Now get the trash and verify the deleted todo appears
      const response = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Check if our deleted todo is in the response
      const deletedTodoInResponse = response.body.data.find(todo => todo.todoId === todoId);
      expect(deletedTodoInResponse).toBeDefined();
      expect(deletedTodoInResponse.status).toBe('deleted');
    });

    test('should return only deleted todos', async () => {
      // Create an active todo
      const activeTodoData = {
        title: 'Active Todo',
        content: 'This should not appear in trash',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const activeResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(activeTodoData)
        .expect(201);
      
      const activeTodoId = activeResponse.body.data.todoId;

      // Create another todo and delete it
      const deletedTodoData = {
        title: 'Deleted Todo',
        content: 'This should appear in trash',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const deletedResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deletedTodoData)
        .expect(201);
      
      const deletedTodoId = deletedResponse.body.data.todoId;

      // Delete the second todo to put it in trash
      await request(app)
        .delete(`/api/todos/${deletedTodoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Get the trash and verify only the deleted todo appears
      const response = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // The active todo should not be in trash
      const activeTodoInTrash = response.body.data.find(todo => todo.todoId === activeTodoId);
      expect(activeTodoInTrash).toBeUndefined();
      
      // The deleted todo should be in trash
      const deletedTodoInTrash = response.body.data.find(todo => todo.todoId === deletedTodoId);
      expect(deletedTodoInTrash).toBeDefined();
      expect(deletedTodoInTrash.status).toBe('deleted');
    });

    test('should return empty array when no deleted todos', async () => {
      const response = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('DELETE /api/trash/:id', () => {
    test('should permanently delete a todo from trash successfully', async () => {
      // Create a todo and delete it to put it in trash
      const newTodo = {
        title: 'Test Todo for Permanent Delete',
        content: 'This will be permanently deleted',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201);
      
      const todoId = createResponse.body.data.todoId;

      // Delete the todo to put it in trash
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify the todo appears in trash
      const trashResponse = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(trashResponse.body.data.some(todo => todo.todoId === todoId)).toBe(true);

      // Permanently delete the todo from trash
      const response = await request(app)
        .delete(`/api/trash/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('할일이 영구적으로 삭제되었습니다');
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete(`/api/trash/${generateUUID()}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should return 400 for active todo (not in trash)', async () => {
      // Create an active todo
      const newTodo = {
        title: 'Active Todo',
        content: 'This is not deleted',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201);
      
      const todoId = createResponse.body.data.todoId;

      // Try to permanently delete an active todo
      const response = await request(app)
        .delete(`/api/trash/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should return 403 when trying to permanently delete another user\'s trash item', async () => {
      // Create a todo with the main user and delete it to put in trash
      const newTodo = {
        title: 'Test Todo for Other User',
        content: 'This belongs to other user',
        startDate: '2025-01-01',
        dueDate: '2025-12-31'
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(newTodo)
        .expect(201);
      
      const todoId = createResponse.body.data.todoId;

      // Delete the todo to put it in trash
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(200);

      // Verify the other user can see it in their trash
      await request(app)
        .get(`/api/trash`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(200);

      // Try to permanently delete using the main user's token (should fail)
      const response = await request(app)
        .delete(`/api/trash/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});