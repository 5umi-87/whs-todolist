// src/repositories/todoRepository.js
const { Pool } = require('pg');

// Create a pool instance
let pool;

// Check if we're in test mode to use mocked data instead of real database
if (process.env.NODE_ENV === 'test') {
  // Export mock repository methods for test environment
  const mockTodos = [];
  
  module.exports = {
    createTodo: async (todoData) => {
      const newTodo = {
        todo_id: todoData.todoId || require('crypto').randomUUID(),
        user_id: todoData.userId,
        title: todoData.title,
        content: todoData.content || null,
        start_date: todoData.startDate || null,
        due_date: todoData.dueDate || null,
        status: todoData.status || 'active',
        is_completed: todoData.isCompleted || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: todoData.deletedAt || null
      };
      
      mockTodos.push(newTodo);
      
      // Map the database field names (snake_case) to API field names (camelCase)
      return {
        todoId: newTodo.todo_id,
        userId: newTodo.user_id,
        title: newTodo.title,
        content: newTodo.content,
        startDate: newTodo.start_date,
        dueDate: newTodo.due_date,
        status: newTodo.status,
        isCompleted: newTodo.is_completed,
        createdAt: newTodo.created_at,
        updatedAt: newTodo.updated_at,
        deletedAt: newTodo.deleted_at
      };
    },

    findTodosByUserId: async (userId, status = null) => {
      let filteredTodos = mockTodos.filter(todo => todo.user_id === userId);
      
      if (status) {
        filteredTodos = filteredTodos.filter(todo => todo.status === status);
      }
      
      return filteredTodos.map(todo => ({
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      }));
    },

    findTodoById: async (todoId) => {
      const todo = mockTodos.find(todo => todo.todo_id === todoId);
      if (!todo) return null;
      
      return {
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      };
    },

    updateTodo: async (todoId, updateData) => {
      const todoIndex = mockTodos.findIndex(todo => todo.todo_id === todoId);
      if (todoIndex === -1) return null;
      
      const updatedTodo = {
        ...mockTodos[todoIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      mockTodos[todoIndex] = updatedTodo;
      
      return {
        todoId: updatedTodo.todo_id,
        userId: updatedTodo.user_id,
        title: updatedTodo.title,
        content: updatedTodo.content,
        startDate: updatedTodo.start_date,
        dueDate: updatedTodo.due_date,
        status: updatedTodo.status,
        isCompleted: updatedTodo.is_completed,
        createdAt: updatedTodo.created_at,
        updatedAt: updatedTodo.updated_at,
        deletedAt: updatedTodo.deleted_at
      };
    },

    softDeleteTodo: async (todoId) => {
      const todoIndex = mockTodos.findIndex(todo => todo.todo_id === todoId);
      if (todoIndex === -1) return null;
      
      const deletedTodo = {
        ...mockTodos[todoIndex],
        status: 'deleted',
        deleted_at: new Date().toISOString()
      };
      
      mockTodos[todoIndex] = deletedTodo;
      
      return {
        todoId: deletedTodo.todo_id,
        userId: deletedTodo.user_id,
        title: deletedTodo.title,
        content: deletedTodo.content,
        startDate: deletedTodo.start_date,
        dueDate: deletedTodo.due_date,
        status: deletedTodo.status,
        isCompleted: deletedTodo.is_completed,
        createdAt: deletedTodo.created_at,
        updatedAt: deletedTodo.updated_at,
        deletedAt: deletedTodo.deleted_at
      };
    },

    // Get all deleted todos for a user (trash items)
    findDeletedTodosByUserId: async (userId) => {
      const filteredTodos = mockTodos.filter(todo => todo.user_id === userId && todo.status === 'deleted');

      return filteredTodos.map(todo => ({
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      }));
    },

    // Permanently delete a todo from the database
    permanentlyDeleteTodo: async (todoId) => {
      const todoIndex = mockTodos.findIndex(todo => todo.todo_id === todoId);
      if (todoIndex === -1) return null;

      // Find and return the todo before removing it
      const todoToRemove = mockTodos[todoIndex];
      const removedTodo = { ...todoToRemove };

      // Remove the todo from the array
      mockTodos.splice(todoIndex, 1);

      return {
        todoId: removedTodo.todo_id,
        userId: removedTodo.user_id,
        title: removedTodo.title,
        content: removedTodo.content,
        startDate: removedTodo.start_date,
        dueDate: removedTodo.due_date,
        status: removedTodo.status,
        isCompleted: removedTodo.is_completed,
        createdAt: removedTodo.created_at,
        updatedAt: removedTodo.updated_at,
        deletedAt: removedTodo.deleted_at
      };
    },

    restoreTodo: async (todoId) => {
      const todoIndex = mockTodos.findIndex(todo => todo.todo_id === todoId);
      if (todoIndex === -1) return null;

      const restoredTodo = {
        ...mockTodos[todoIndex],
        status: 'active',
        deleted_at: null
      };

      mockTodos[todoIndex] = restoredTodo;

      return {
        todoId: restoredTodo.todo_id,
        userId: restoredTodo.user_id,
        title: restoredTodo.title,
        content: restoredTodo.content,
        startDate: restoredTodo.start_date,
        dueDate: restoredTodo.due_date,
        status: restoredTodo.status,
        isCompleted: restoredTodo.is_completed,
        createdAt: restoredTodo.created_at,
        updatedAt: restoredTodo.updated_at,
        deletedAt: restoredTodo.deleted_at
      };
    }
  };
} else {
  // Use real database connection for development and production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  module.exports = {
    createTodo: async (todoData) => {
      const { userId, title, content, startDate, dueDate } = todoData;

      const query = `
        INSERT INTO todos (user_id, title, content, start_date, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING todo_id, user_id, title, content, start_date, due_date, 
                 status, is_completed, created_at, updated_at, deleted_at
      `;

      const result = await pool.query(query, [userId, title, content, startDate, dueDate]);
      const todo = result.rows[0];
      
      // Map the database field names (snake_case) to API field names (camelCase)
      return {
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      };
    },

    findTodosByUserId: async (userId, status = null) => {
      let query = 'SELECT todo_id, user_id, title, content, start_date, due_date, status, is_completed, created_at, updated_at, deleted_at FROM todos WHERE user_id = $1';
      const params = [userId];
      
      if (status) {
        query += ' AND status = $2';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      
      return result.rows.map(todo => ({
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      }));
    },

    findTodoById: async (todoId) => {
      const query = 'SELECT todo_id, user_id, title, content, start_date, due_date, status, is_completed, created_at, updated_at, deleted_at FROM todos WHERE todo_id = $1';
      const result = await pool.query(query, [todoId]);
      
      if (result.rows.length === 0) return null;
      
      const todo = result.rows[0];
      
      return {
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      };
    },

    updateTodo: async (todoId, updateData) => {
      const { title, content, startDate, dueDate } = updateData;
      
      const query = `
        UPDATE todos
        SET title = $1, content = $2, start_date = $3, due_date = $4, updated_at = NOW()
        WHERE todo_id = $5
        RETURNING todo_id, user_id, title, content, start_date, due_date, 
                 status, is_completed, created_at, updated_at, deleted_at
      `;
      
      const result = await pool.query(query, [title, content, startDate, dueDate, todoId]);
      
      if (result.rows.length === 0) return null;
      
      const updatedTodo = result.rows[0];
      
      return {
        todoId: updatedTodo.todo_id,
        userId: updatedTodo.user_id,
        title: updatedTodo.title,
        content: updatedTodo.content,
        startDate: updatedTodo.start_date,
        dueDate: updatedTodo.due_date,
        status: updatedTodo.status,
        isCompleted: updatedTodo.is_completed,
        createdAt: updatedTodo.created_at,
        updatedAt: updatedTodo.updated_at,
        deletedAt: updatedTodo.deleted_at
      };
    },

    softDeleteTodo: async (todoId) => {
      const query = `
        UPDATE todos
        SET status = 'deleted', deleted_at = NOW()
        WHERE todo_id = $1
        RETURNING todo_id, user_id, title, content, start_date, due_date, 
                 status, is_completed, created_at, updated_at, deleted_at
      `;
      
      const result = await pool.query(query, [todoId]);
      
      if (result.rows.length === 0) return null;
      
      const deletedTodo = result.rows[0];
      
      return {
        todoId: deletedTodo.todo_id,
        userId: deletedTodo.user_id,
        title: deletedTodo.title,
        content: deletedTodo.content,
        startDate: deletedTodo.start_date,
        dueDate: deletedTodo.due_date,
        status: deletedTodo.status,
        isCompleted: deletedTodo.is_completed,
        createdAt: deletedTodo.created_at,
        updatedAt: deletedTodo.updated_at,
        deletedAt: deletedTodo.deleted_at
      };
    },

    // Get all deleted todos for a user (trash items)
    findDeletedTodosByUserId: async (userId) => {
      const query = `SELECT todo_id, user_id, title, content, start_date, due_date, status, is_completed, created_at, updated_at, deleted_at FROM todos WHERE user_id = $1 AND status = 'deleted' ORDER BY deleted_at DESC`;
      const result = await pool.query(query, [userId]);

      return result.rows.map(todo => ({
        todoId: todo.todo_id,
        userId: todo.user_id,
        title: todo.title,
        content: todo.content,
        startDate: todo.start_date,
        dueDate: todo.due_date,
        status: todo.status,
        isCompleted: todo.is_completed,
        createdAt: todo.created_at,
        updatedAt: todo.updated_at,
        deletedAt: todo.deleted_at
      }));
    },

    // Permanently delete a todo from the database
    permanentlyDeleteTodo: async (todoId) => {
      const query = `DELETE FROM todos WHERE todo_id = $1 RETURNING todo_id, user_id, title, content, start_date, due_date, status, is_completed, created_at, updated_at, deleted_at`;

      const result = await pool.query(query, [todoId]);

      if (result.rows.length === 0) return null;

      const deletedTodo = result.rows[0];

      return {
        todoId: deletedTodo.todo_id,
        userId: deletedTodo.user_id,
        title: deletedTodo.title,
        content: deletedTodo.content,
        startDate: deletedTodo.start_date,
        dueDate: deletedTodo.due_date,
        status: deletedTodo.status,
        isCompleted: deletedTodo.is_completed,
        createdAt: deletedTodo.created_at,
        updatedAt: deletedTodo.updated_at,
        deletedAt: deletedTodo.deleted_at
      };
    },

    restoreTodo: async (todoId) => {
      const query = `
        UPDATE todos
        SET status = 'active', deleted_at = NULL
        WHERE todo_id = $1
        RETURNING todo_id, user_id, title, content, start_date, due_date,
                 status, is_completed, created_at, updated_at, deleted_at
      `;

      const result = await pool.query(query, [todoId]);

      if (result.rows.length === 0) return null;

      const restoredTodo = result.rows[0];

      return {
        todoId: restoredTodo.todo_id,
        userId: restoredTodo.user_id,
        title: restoredTodo.title,
        content: restoredTodo.content,
        startDate: restoredTodo.start_date,
        dueDate: restoredTodo.due_date,
        status: restoredTodo.status,
        isCompleted: restoredTodo.is_completed,
        createdAt: restoredTodo.created_at,
        updatedAt: restoredTodo.updated_at,
        deletedAt: restoredTodo.deleted_at
      };
    }
  };
}