// src/controllers/todoController.js
const { body, param, query, validationResult } = require('express-validator');
const todoService = require('../services/todoService');

/**
 * Controller for creating a new todo
 */
const createTodo = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    
    const { title, content, startDate, dueDate } = req.body;
    const userId = req.user.userId; // Extracted from auth middleware
    
    // Create the todo
    const todo = await todoService.createTodo({
      userId,
      title,
      content,
      startDate,
      dueDate
    });
    
    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === 'DUE_DATE_BEFORE_START_DATE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: 'Due date cannot be before start date'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_TODO_ERROR',
        message: 'Failed to create todo'
      }
    });
  }
};

/**
 * Controller for getting all todos
 */
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from auth middleware
    
    // Parse query parameters
    const { status, search, sortBy, order } = req.query;
    
    // Get todos with filters
    const todos = await todoService.getTodosByUser(userId, {
      status,
      search,
      sortBy,
      order
    });
    
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TODOS_ERROR',
        message: 'Failed to retrieve todos'
      }
    });
  }
};

/**
 * Controller for getting a single todo by ID
 */
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware
    
    const todo = await todoService.getTodoById(id, userId);
    
    if (!todo) {
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
      data: todo
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
    
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TODO_ERROR',
        message: 'Failed to retrieve todo'
      }
    });
  }
};

/**
 * Controller for updating a todo
 */
const updateTodo = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }
    
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware
    const { title, content, startDate, dueDate } = req.body;
    
    const updatedTodo = await todoService.updateTodo(id, userId, {
      title,
      content,
      startDate,
      dueDate
    });
    
    if (!updatedTodo) {
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
      data: updatedTodo
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
    
    if (error.message === 'DUE_DATE_BEFORE_START_DATE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: 'Due date cannot be before start date'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_TODO_ERROR',
        message: 'Failed to update todo'
      }
    });
  }
};

/**
 * Controller for deleting (soft deleting) a todo
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware
    
    const deletedTodo = await todoService.deleteTodo(id, userId);
    
    if (!deletedTodo) {
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
      message: '할일이 휴지통으로 이동되었습니다',
      data: deletedTodo
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
    
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_TODO_ERROR',
        message: 'Failed to delete todo'
      }
    });
  }
};

/**
 * Controller for completing a todo
 */
const completeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware
    
    const completedTodo = await todoService.completeTodo(id, userId);
    
    if (!completedTodo) {
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
      data: completedTodo
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
    
    if (error.message === 'TODO_IS_DELETED') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TODO_IS_DELETED',
          message: 'Cannot complete a deleted todo'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'COMPLETE_TODO_ERROR',
        message: 'Failed to complete todo'
      }
    });
  }
};

/**
 * Controller for restoring a deleted todo
 */
const restoreTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Extracted from auth middleware
    
    const restoredTodo = await todoService.restoreTodo(id, userId);
    
    if (!restoredTodo) {
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
      message: '할일이 복원되었습니다',
      data: restoredTodo
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
          message: 'Todo is not in deleted status'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'RESTORE_TODO_ERROR',
        message: 'Failed to restore todo'
      }
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  completeTodo,
  restoreTodo,
};