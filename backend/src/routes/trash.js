// src/routes/trash.js
const express = require('express');
const { param } = require('express-validator');
const { 
  getTrashItems, 
  permanentlyDeleteTodo 
} = require('../controllers/trashController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Validation for todo ID parameter
const todoIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid todo ID is required')
];

/**
 * @swagger
 * tags:
 *   name: Trash
 *   description: API for managing deleted todos
 */

/**
 * @swagger
 * /api/trash:
 *   get:
 *     summary: Get all deleted todos for the authenticated user
 *     tags: [Trash]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted todos retrieved successfully
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
router.get('/', auth, getTrashItems);

/**
 * @swagger
 * /api/trash/{id}:
 *   delete:
 *     summary: Permanently delete a specific todo
 *     tags: [Trash]
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
 *         description: Todo permanently deleted successfully
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
 *                   example: "Todo permanently deleted"
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, todoIdValidation, permanentlyDeleteTodo);

module.exports = router;