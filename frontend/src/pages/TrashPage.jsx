import React from 'react';

const TrashPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">휴지통</h1>
        <p className="text-gray-600 dark:text-gray-300">
          삭제된 할일을 복원하거나 영구 삭제할 수 있습니다
        </p>
      </div>

      {/* Trash content will go here */}
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-4xl">🗑️</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">휴지통이 비어있습니다</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          삭제한 할일이 없습니다
        </p>
      </div>
    </div>
  );
};

export default TrashPage;