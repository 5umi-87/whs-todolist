import React, { useState, useEffect } from 'react';
import { useHolidayStore } from '../stores/holidayStore';
import { useAuthStore } from '../stores/authStore';

const HolidaysPage = () => {
  const { holidays, loading, error, fetchHolidays } = useHolidayStore();
  const { isAuthenticated } = useAuthStore();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isAuthenticated) {
      fetchHolidays(year);
    }
  }, [year, isAuthenticated, fetchHolidays]);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">국경일</h1>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-main"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Holiday list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.length > 0 ? (
            holidays.map((holiday) => (
              <div
                key={holiday.holidayId}
                className="border rounded-lg p-4 shadow-sm bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-300">
                    {holiday.title} 🎊
                  </h3>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {holiday.description}
                  </p>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    📅 {holiday.date}
                  </p>
                  <div className="mt-2">
                    {holiday.isRecurring && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        매년 반복
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl">📅</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">국경일이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {year}년의 국경일이 등록되지 않았습니다
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HolidaysPage;