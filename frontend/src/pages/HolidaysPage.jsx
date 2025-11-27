import React from 'react';

const HolidaysPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">국경일</h1>
        <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>

      {/* Holiday content will go here */}
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-4xl">📅</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">국경일이 없습니다</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          해당 연도의 국경일이 등록되지 않았습니다
        </p>
      </div>
    </div>
  );
};

export default HolidaysPage;