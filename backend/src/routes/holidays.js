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

/**
 * @swagger
 * tags:
 *   name: Holidays
 *   description: API for managing holidays
 */

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays with optional year/month filtering
 *     tags: [Holidays]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2023
 *         description: Filter holidays by year
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           example: 12
 *           minimum: 1
 *           maximum: 12
 *         description: Filter holidays by month (1-12)
 *     responses:
 *       200:
 *         description: List of holidays retrieved successfully
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
 *                     $ref: '#/components/schemas/Holiday'
 *       500:
 *         description: Server error
 */
router.get('/', auth, holidayQueryValidation, getHolidays);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: Create a new holiday (admin only)
 *     tags: [Holidays]
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
 *                 example: "New Year's Day"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               description:
 *                 type: string
 *                 example: "New Year's Day celebration"
 *               isRecurring:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Holiday created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', auth, createHolidayValidation, createHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   put:
 *     summary: Update a holiday (admin only)
 *     tags: [Holidays]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Holiday ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Year's Day"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               description:
 *                 type: string
 *                 example: "New Year's Day celebration"
 *               isRecurring:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Holiday updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Holiday'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Holiday not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, holidayIdValidation, updateHolidayValidation, updateHoliday);

module.exports = router;