// src/repositories/holidayRepository.js
const { Pool } = require('pg');

// Create a pool instance
let pool;

// Check if we're in test mode to use mocked data instead of real database
if (process.env.NODE_ENV === 'test') {
  // Export mock repository methods for test environment
  const mockHolidays = [
    {
      holiday_id: '4b1e5f8c-4d8e-4b1e-8e8c-4b1e5f8c4d8e',
      title: 'New Year',
      date: '2025-01-01',
      description: 'New Year\'s Day',
      is_recurring: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      holiday_id: '5c2f6g9d-5e9f-5c2f-9f9d-5c2f6g9d5e9f',
      title: 'Christmas',
      date: '2025-12-25',
      description: 'Christmas Day',
      is_recurring: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  module.exports = {
    getHolidays: async (filters = {}) => {
      let filteredHolidays = [...mockHolidays];

      if (filters.year) {
        filteredHolidays = filteredHolidays.filter(holiday => 
          new Date(holiday.date).getFullYear() == filters.year
        );
      }

      if (filters.month) {
        filteredHolidays = filteredHolidays.filter(holiday => 
          (new Date(holiday.date).getMonth() + 1) == filters.month
        );
      }

      return filteredHolidays.map(holiday => ({
        holidayId: holiday.holiday_id,
        title: holiday.title,
        date: holiday.date,
        description: holiday.description,
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
        updatedAt: holiday.updated_at
      }));
    },

    createHoliday: async (holidayData) => {
      const newHoliday = {
        holiday_id: holidayData.holidayId || require('crypto').randomUUID(),
        title: holidayData.title,
        date: holidayData.date,
        description: holidayData.description || null,
        is_recurring: holidayData.isRecurring !== undefined ? holidayData.isRecurring : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockHolidays.push(newHoliday);

      return {
        holidayId: newHoliday.holiday_id,
        title: newHoliday.title,
        date: newHoliday.date,
        description: newHoliday.description,
        isRecurring: newHoliday.is_recurring,
        createdAt: newHoliday.created_at,
        updatedAt: newHoliday.updated_at
      };
    },

    getHolidayById: async (holidayId) => {
      const holiday = mockHolidays.find(holiday => holiday.holiday_id === holidayId);
      if (!holiday) return null;

      return {
        holidayId: holiday.holiday_id,
        title: holiday.title,
        date: holiday.date,
        description: holiday.description,
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
        updatedAt: holiday.updated_at
      };
    },

    updateHoliday: async (holidayId, updateData) => {
      const holidayIndex = mockHolidays.findIndex(holiday => holiday.holiday_id === holidayId);
      if (holidayIndex === -1) return null;

      const updatedHoliday = {
        ...mockHolidays[holidayIndex],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      mockHolidays[holidayIndex] = updatedHoliday;

      return {
        holidayId: updatedHoliday.holiday_id,
        title: updatedHoliday.title,
        date: updatedHoliday.date,
        description: updatedHoliday.description,
        isRecurring: updatedHoliday.is_recurring,
        createdAt: updatedHoliday.created_at,
        updatedAt: updatedHoliday.updated_at
      };
    }
  };
} else {
  // Use real database connection for development and production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  // Helper function to format DATE fields as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === 'string') return date;
    // Convert Date object to YYYY-MM-DD format in local time
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  module.exports = {
    getHolidays: async (filters = {}) => {
      let query = 'SELECT holiday_id, title, date, description, is_recurring, created_at, updated_at FROM holidays';
      const params = [];
      let conditionAdded = false;

      if (filters.year || filters.month) {
        query += ' WHERE';
        
        if (filters.year) {
          query += ` EXTRACT(YEAR FROM date) = $${params.length + 1}`;
          params.push(filters.year);
          conditionAdded = true;
        }

        if (filters.month) {
          if (conditionAdded) query += ' AND';
          query += ` EXTRACT(MONTH FROM date) = $${params.length + 1}`;
          params.push(filters.month);
          conditionAdded = true;
        }
      }

      query += ' ORDER BY date';

      const result = await pool.query(query, params);

      return result.rows.map(holiday => ({
        holidayId: holiday.holiday_id,
        title: holiday.title,
        date: formatDate(holiday.date),
        description: holiday.description,
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
        updatedAt: holiday.updated_at
      }));
    },

    createHoliday: async (holidayData) => {
      const { title, date, description, isRecurring = true } = holidayData;

      const query = `
        INSERT INTO holidays (title, date, description, is_recurring)
        VALUES ($1, $2, $3, $4)
        RETURNING holiday_id, title, date, description, is_recurring, created_at, updated_at
      `;

      const result = await pool.query(query, [title, date, description, isRecurring]);
      const holiday = result.rows[0];

      return {
        holidayId: holiday.holiday_id,
        title: holiday.title,
        date: formatDate(holiday.date),
        description: holiday.description,
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
        updatedAt: holiday.updated_at
      };
    },

    getHolidayById: async (holidayId) => {
      const query = 'SELECT holiday_id, title, date, description, is_recurring, created_at, updated_at FROM holidays WHERE holiday_id = $1';
      const result = await pool.query(query, [holidayId]);

      if (result.rows.length === 0) return null;

      const holiday = result.rows[0];

      return {
        holidayId: holiday.holiday_id,
        title: holiday.title,
        date: formatDate(holiday.date),
        description: holiday.description,
        isRecurring: holiday.is_recurring,
        createdAt: holiday.created_at,
        updatedAt: holiday.updated_at
      };
    },

    updateHoliday: async (holidayId, updateData) => {
      const { title, date, description, isRecurring } = updateData;

      // Build dynamic query based on what fields are being updated
      const setFields = [];
      const values = [holidayId];
      let valueIndex = 2;

      if (title !== undefined) {
        setFields.push(`title = $${valueIndex}`);
        values.push(title);
        valueIndex++;
      }

      if (date !== undefined) {
        setFields.push(`date = $${valueIndex}`);
        values.push(date);
        valueIndex++;
      }

      if (description !== undefined) {
        setFields.push(`description = $${valueIndex}`);
        values.push(description);
        valueIndex++;
      }

      if (isRecurring !== undefined) {
        setFields.push(`is_recurring = $${valueIndex}`);
        values.push(isRecurring);
        valueIndex++;
      }

      // Update the updated_at timestamp
      setFields.push(`updated_at = NOW()`);

      if (setFields.length === 1) { // Only updated_at was set
        return null; // Nothing to update
      }

      const query = `
        UPDATE holidays
        SET ${setFields.join(', ')}
        WHERE holiday_id = $1
        RETURNING holiday_id, title, date, description, is_recurring, created_at, updated_at
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) return null;

      const updatedHoliday = result.rows[0];

      return {
        holidayId: updatedHoliday.holiday_id,
        title: updatedHoliday.title,
        date: formatDate(updatedHoliday.date),
        description: updatedHoliday.description,
        isRecurring: updatedHoliday.is_recurring,
        createdAt: updatedHoliday.created_at,
        updatedAt: updatedHoliday.updated_at
      };
    }
  };
}