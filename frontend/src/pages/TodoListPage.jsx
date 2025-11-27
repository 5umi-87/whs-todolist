import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import { useHolidayStore } from '../stores/holidayStore';
import { useAuthStore } from '../stores/authStore';

const TodoListPage = () => {
  const { todos, loading, error, fetchTodos } = useTodoStore();
  const { holidays, fetchHolidays } = useHolidayStore();
  const { isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos(filter === 'all' ? undefined : filter);
      fetchHolidays(); // Fetch holidays as well
    }
  }, [filter, isAuthenticated, fetchTodos, fetchHolidays]);

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return todo.status === 'active' && !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return todo.status === filter;
  });

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return null;
  }

  // Combine todos and holidays, with holidays having a special flag
  const allItems = [
    ...filteredTodos.map(todo => ({ ...todo, isTodo: true })),
    ...holidays.map(holiday => ({ ...holiday, isHoliday: true }))
  ];

  // Sort by date (closest first)
  allItems.sort((a, b) => {
    const dateA = new Date(a.dueDate || a.startDate || a.date);
    const dateB = new Date(b.dueDate || b.startDate || b.date);
    return dateA - dateB;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">나의 할일 목록</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
        >
          <Plus className="mr-2 h-4 w-4" />
          할일 추가
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-4">
        {['all', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              filter === tab
                ? 'bg-primary-main text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'all' && '전체'}
            {tab === 'active' && '진행중'}
            {tab === 'completed' && '완료'}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {(loading || !isAuthenticated) && (
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

      {/* Combined todo and holiday list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allItems.length > 0 ? (
            allItems.map((item) => {
              if (item.isTodo) {
                return (
                  <div
                    key={item.todoId}
                    className={`border rounded-lg p-4 shadow-sm ${
                      item.isCompleted
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => {
                          // Handle todo completion
                        }}
                        className="mt-1 h-4 w-4 text-primary-main focus:ring-primary-main border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className={`text-lg font-medium ${
                          item.isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.content}
                          </p>
                        )}
                        {item.dueDate && (
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            📅 {item.startDate} ~ {item.dueDate}
                          </p>
                        )}
                        <div className="mt-2 flex space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            수정
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Holiday item
                return (
                  <div
                    key={item.holidayId}
                    className="border rounded-lg p-4 shadow-sm bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"
                  >
                    <div className="flex items-start">
                      <div className="ml-3 flex-1">
                        <h3 className="text-lg font-medium text-red-700 dark:text-red-300">
                          {item.title} 🎊
                        </h3>
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {item.description}
                        </p>
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          📅 {item.date}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          {item.isRecurring && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                              매년 반복
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500">📝</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">할일이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                첫 할일을 추가해보세요!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
                >
                  할일 추가
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center h-14 w-14 rounded-full shadow-lg bg-primary-main hover:bg-primary-dark text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default TodoListPage;