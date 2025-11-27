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

// GET /api/trash - Get all deleted todos for the authenticated user
router.get('/', auth, getTrashItems);

// DELETE /api/trash/:id - Permanently delete a specific todo
router.delete('/:id', auth, todoIdValidation, permanentlyDeleteTodo);

module.exports = router;