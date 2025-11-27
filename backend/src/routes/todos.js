// src/routes/todos.js
const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  createTodo, 
  getTodos, 
  getTodoById, 
  updateTodo, 
  deleteTodo, 
  completeTodo, 
  restoreTodo 
} = require('../controllers/todoController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Validation rules for creating/updating todos
const todoValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('content')
    .optional({ nullable: true })
    .trim(),
  body('startDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

// Validation for todo ID parameter
const todoIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid todo ID is required')
];

// Validation for query parameters for filtering
const getTodosQueryValidation = [
  query('status')
    .optional()
    .isIn(['active', 'completed', 'deleted'])
    .withMessage('Status must be active, completed, or deleted'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term must be at least 1 character'),
  query('sortBy')
    .optional()
    .isIn(['dueDate', 'createdAt'])
    .withMessage('Sort by must be dueDate or createdAt'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

// POST /api/todos - Create a new todo
router.post('/', auth, todoValidation, createTodo);

// GET /api/todos - Get all todos for the authenticated user
router.get('/', auth, getTodosQueryValidation, getTodos);

// GET /api/todos/:id - Get a specific todo
router.get('/:id', auth, todoIdValidation, getTodoById);

// PUT /api/todos/:id - Update a specific todo
router.put('/:id', auth, todoIdValidation, todoValidation, updateTodo);

// DELETE /api/todos/:id - Delete (soft delete) a specific todo
router.delete('/:id', auth, todoIdValidation, deleteTodo);

// PATCH /api/todos/:id/complete - Mark a todo as complete
router.patch('/:id/complete', auth, todoIdValidation, completeTodo);

// PATCH /api/todos/:id/restore - Restore a deleted todo
router.patch('/:id/restore', auth, todoIdValidation, restoreTodo);

module.exports = router;