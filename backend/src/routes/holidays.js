// src/routes/holidays.js
const express = require('express');
const { body, param, query } = require('express-validator');
const { 
  getHolidays, 
  createHoliday, 
  updateHoliday 
} = require('../controllers/holidayController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Validation rules for holiday creation
const createHolidayValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean')
];

// Validation rules for holiday updates
const updateHolidayValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must have at least 1 character'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean')
];

// Validation for holiday ID parameter
const holidayIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid holiday ID is required')
];

// Validation for query parameters
const holidayQueryValidation = [
  query('year')
    .optional()
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be a valid year (1900-2100)'),
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12')
];

// GET /api/holidays - Get all holidays with optional year/month filtering
router.get('/', auth, holidayQueryValidation, getHolidays);

// POST /api/holidays - Create a new holiday (admin only)
router.post('/', auth, createHolidayValidation, createHoliday);

// PUT /api/holidays/:id - Update a holiday (admin only)
router.put('/:id', auth, holidayIdValidation, updateHolidayValidation, updateHoliday);

module.exports = router;