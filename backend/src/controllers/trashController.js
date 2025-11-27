// src/controllers/trashController.js
const { param } = require('express-validator');
const todoService = require('../services/todoService');

/**
 * Controller for getting trash items (deleted todos)
 */
const getTrashItems = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware

    const trashItems = await todoService.getTrashItems(userId);

    res.status(200).json({
      success: true,
      data: trashItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TRASH_ERROR',
        message: 'Failed to retrieve trash items'
      }
    });
  }
};

/**
 * Controller for permanently deleting a todo
 */
const permanentlyDeleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware

    // Validate the ID parameter
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Valid todo ID is required'
        }
      });
    }

    const result = await todoService.permanentlyDeleteTodo(id, userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: 'Todo not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: '할일이 영구적으로 삭제되었습니다'
    });
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this todo'
        }
      });
    }

    if (error.message === 'TODO_NOT_DELETED') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TODO_NOT_DELETED',
          message: 'Cannot permanently delete an active todo'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'PERMANENT_DELETE_ERROR',
        message: 'Failed to permanently delete todo'
      }
    });
  }
};

module.exports = {
  getTrashItems,
  permanentlyDeleteTodo,
};