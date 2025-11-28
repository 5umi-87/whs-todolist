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

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: API for managing todos
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Todo"
 *               content:
 *                 type: string
 *                 example: "Todo content"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-01"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation error or invalid date range
 *       500:
 *         description: Server error
 */
router.post('/', auth, todoValidation, createTodo);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, deleted]
 *         description: Filter todos by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search todos by title or content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [dueDate, createdAt]
 *         description: Sort by due date or creation date
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 */
router.get('/', auth, getTodosQueryValidation, getTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, todoIdValidation, getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a specific todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Todo"
 *               content:
 *                 type: string
 *                 example: "Updated content"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-01"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation error or invalid date range
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, todoIdValidation, todoValidation, updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete (soft delete) a specific todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo moved to trash successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "할일이 휴지통으로 이동되었습니다"
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, todoIdValidation, deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/complete:
 *   patch:
 *     summary: Mark a todo as complete
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Cannot complete a deleted todo
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/complete', auth, todoIdValidation, completeTodo);

/**
 * @swagger
 * /api/todos/{id}/restore:
 *   patch:
 *     summary: Restore a deleted todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "할일이 복원되었습니다"
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Todo is not in deleted status
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/restore', auth, todoIdValidation, restoreTodo);

module.exports = router;