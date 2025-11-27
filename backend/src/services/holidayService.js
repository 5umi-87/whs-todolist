// src/services/holidayService.js
const holidayRepository = require('../repositories/holidayRepository');

/**
 * Gets all holidays with optional filters
 * @param {Object} filters - Filters for holidays (year, month)
 * @returns {Promise<Array>} List of holidays
 */
const getHolidays = async (filters = {}) => {
  return await holidayRepository.getHolidays(filters);
};

/**
 * Creates a new holiday
 * @param {Object} holidayData - Holiday data (title, date, description, isRecurring)
 * @returns {Promise<Object>} Created holiday object
 */
const createHoliday = async (holidayData) => {
  // Basic validation
  if (!holidayData.title || !holidayData.date) {
    throw new Error('TITLE_AND_DATE_REQUIRED');
  }

  // Additional validation could be added here if needed

  return await holidayRepository.createHoliday(holidayData);
};

/**
 * Updates an existing holiday
 * @param {string} holidayId - Holiday ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated holiday object
 */
const updateHoliday = async (holidayId, updateData) => {
  // Check if the holiday exists
  const existingHoliday = await holidayRepository.getHolidayById(holidayId);
  
  if (!existingHoliday) {
    throw new Error('HOLIDAY_NOT_FOUND');
  }
  
  // Update the holiday
  return await holidayRepository.updateHoliday(holidayId, updateData);
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday,
};