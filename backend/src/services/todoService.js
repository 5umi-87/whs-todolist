// src/services/todoService.js
const todoRepository = require('../repositories/todoRepository');

/**
 * Creates a new todo
 * @param {Object} todoData - Todo data (userId, title, content, startDate, dueDate)
 * @returns {Promise<Object>} Created todo object
 */
const createTodo = async (todoData) => {
  // Validate date range if both dates are provided
  if (todoData.startDate && todoData.dueDate) {
    const start = new Date(todoData.startDate);
    const due = new Date(todoData.dueDate);
    if (due < start) {
      throw new Error('DUE_DATE_BEFORE_START_DATE');
    }
  }

  return await todoRepository.createTodo({
    ...todoData,
    status: 'active',
    isCompleted: false
  });
};

/**
 * Gets all todos for a specific user
 * @param {string} userId - User ID
 * @param {Object} queryOptions - Options for filtering, sorting, and pagination
 * @returns {Promise<Array>} List of todos
 */
const getTodosByUser = async (userId, queryOptions = {}) => {
  const { status, search, sortBy = 'createdAt', order = 'desc' } = queryOptions;
  
  // Note: In a full implementation, we would use search, sortBy, and order parameters
  // For this implementation, we're just filtering by status
  return await todoRepository.findTodosByUserId(userId, status);
};

/**
 * Gets a specific todo by ID
 * @param {string} todoId - Todo ID
 * @param {string} userId - User ID (to verify ownership)
 * @returns {Promise<Object>} Todo object
 */
const getTodoById = async (todoId, userId) => {
  const todo = await todoRepository.findTodoById(todoId);
  
  // Verify that the todo belongs to the user
  if (todo && todo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
  
  return todo;
};

/**
 * Updates a todo
 * @param {string} todoId - Todo ID to update
 * @param {string} userId - User ID (to verify ownership)
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated todo object
 */
const updateTodo = async (todoId, userId, updateData) => {
  // First get the existing todo to verify ownership
  const existingTodo = await todoRepository.findTodoById(todoId);
  
  if (!existingTodo) {
    throw new Error('TODO_NOT_FOUND');
  }
  
  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
  
  // Validate date range if both dates are provided in update
  if (updateData.startDate || updateData.dueDate) {
    const startDate = updateData.startDate || existingTodo.startDate;
    const dueDate = updateData.dueDate || existingTodo.dueDate;
    
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      if (due < start) {
        throw new Error('DUE_DATE_BEFORE_START_DATE');
      }
    }
  }
  
  return await todoRepository.updateTodo(todoId, updateData);
};

/**
 * Marks a todo as complete
 * @param {string} todoId - Todo ID to update
 * @param {string} userId - User ID (to verify ownership)
 * @returns {Promise<Object>} Updated todo object
 */
const completeTodo = async (todoId, userId) => {
  // First get the existing todo to verify ownership and that it's not deleted
  const existingTodo = await todoRepository.findTodoById(todoId);
  
  if (!existingTodo) {
    throw new Error('TODO_NOT_FOUND');
  }
  
  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
  
  if (existingTodo.status === 'deleted') {
    throw new Error('TODO_IS_DELETED');
  }
  
  return await todoRepository.updateTodo(todoId, {
    status: 'completed',
    isCompleted: true
  });
};

/**
 * Soft deletes a todo
 * @param {string} todoId - Todo ID to delete
 * @param {string} userId - User ID (to verify ownership)
 * @returns {Promise<Object>} Deleted todo object
 */
const deleteTodo = async (todoId, userId) => {
  // First get the existing todo to verify ownership
  const existingTodo = await todoRepository.findTodoById(todoId);
  
  if (!existingTodo) {
    throw new Error('TODO_NOT_FOUND');
  }
  
  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
  
  return await todoRepository.softDeleteTodo(todoId);
};

/**
 * Restores a deleted todo
 * @param {string} todoId - Todo ID to restore
 * @param {string} userId - User ID (to verify ownership)
 * @returns {Promise<Object>} Restored todo object
 */
const restoreTodo = async (todoId, userId) => {
  // First get the existing todo to verify ownership
  const existingTodo = await todoRepository.findTodoById(todoId);
  
  if (!existingTodo) {
    throw new Error('TODO_NOT_FOUND');
  }
  
  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }
  
  // Only allow restoring if the todo is currently deleted
  if (existingTodo.status !== 'deleted') {
    throw new Error('TODO_NOT_DELETED');
  }
  
  return await todoRepository.restoreTodo(todoId);
};

module.exports = {
  createTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
  completeTodo,
  deleteTodo,
  restoreTodo,
};