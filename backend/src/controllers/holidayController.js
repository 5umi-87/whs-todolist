// src/controllers/holidayController.js
const { body, param, query } = require('express-validator');
const holidayService = require('../services/holidayService');

/**
 * Controller for getting holidays
 */
const getHolidays = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { year, month } = req.query;
    
    const filters = {};
    if (year) {
      // Validate year is a number
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        filters.year = yearNum;
      }
    }
    
    if (month) {
      // Validate month is a number between 1 and 12
      const monthNum = parseInt(month, 10);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        filters.month = monthNum;
      }
    }

    const holidays = await holidayService.getHolidays(filters);

    res.status(200).json({
      success: true,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_HOLIDAYS_ERROR',
        message: 'Failed to retrieve holidays'
      }
    });
  }
};

/**
 * Controller for creating a new holiday
 */
const createHoliday = async (req, res) => {
  try {
    // Only admins should be able to create holidays
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only admin users can create holidays'
        }
      });
    }

    const { title, date, description, isRecurring } = req.body;

    const holiday = await holidayService.createHoliday({
      title,
      date,
      description,
      isRecurring
    });

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    if (error.message === 'TITLE_AND_DATE_REQUIRED') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and date are required'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_HOLIDAY_ERROR',
        message: 'Failed to create holiday'
      }
    });
  }
};

/**
 * Controller for updating a holiday
 */
const updateHoliday = async (req, res) => {
  try {
    // Only admins should be able to update holidays
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only admin users can update holidays'
        }
      });
    }

    const { id } = req.params;
    const { title, date, description, isRecurring } = req.body;

    const updatedHoliday = await holidayService.updateHoliday(id, {
      title,
      date,
      description,
      isRecurring
    });

    if (!updatedHoliday) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOLIDAY_NOT_FOUND',
          message: 'Holiday not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: updatedHoliday
    });
  } catch (error) {
    if (error.message === 'HOLIDAY_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOLIDAY_NOT_FOUND',
          message: 'Holiday not found'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_HOLIDAY_ERROR',
        message: 'Failed to update holiday'
      }
    });
  }
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday,
};