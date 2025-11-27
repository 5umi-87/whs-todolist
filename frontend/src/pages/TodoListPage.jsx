import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, CheckCircle, Circle } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import { useHolidayStore } from '../stores/holidayStore';
import { useAuthStore } from '../stores/authStore';
import TodoCard from '../components/common/TodoCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const TodoListPage = () => {
  const { todos, loading, error, fetchTodos, toggleComplete, deleteTodo, updateTodo } = useTodoStore();
  const { holidays, fetchHolidays } = useHolidayStore();
  const { isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [sortOption, setSortOption] = useState('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [todoForm, setTodoForm] = useState({
    title: '',
    content: '',
    startDate: '',
    dueDate: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos(filter === 'all' ? undefined : filter);
      fetchHolidays(); // Fetch holidays as well
    }
  }, [filter, isAuthenticated, fetchTodos, fetchHolidays]);

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return todo.status === 'active';
    if (filter === 'active') return todo.status === 'active' && !todo.isCompleted;
    if (filter === 'completed') return todo.status === 'active' && todo.isCompleted;
    return todo.status === filter;
  });

  // Apply search filter
  const searchedTodos = filteredTodos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (todo.content && todo.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Combine searched todos and holidays, with holidays having a special flag
  const allItems = [
    ...searchedTodos.map(todo => ({ ...todo, isTodo: true })),
    ...holidays.map(holiday => ({ ...holiday, isHoliday: true }))
  ];

  // Sort by selected option
  allItems.sort((a, b) => {
    if (sortOption === 'dueDate') {
      const dateA = new Date(a.dueDate || a.startDate || a.date);
      const dateB = new Date(b.dueDate || b.startDate || b.date);
      return dateA - dateB;
    } else if (sortOption === 'createdAt') {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date); // Descending order
    }
    return 0;
  });

  // Handle todo completion
  const handleToggleComplete = async (id) => {
    const result = await toggleComplete(id);
    if (result.success) {
      // Completion handled by store
    }
  };

  // Handle todo deletion
  const handleDeleteTodo = async (id) => {
    const result = await deleteTodo(id);
    if (result.success) {
      // Deletion handled by store
    }
  };

  // Handle opening edit modal
  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setTodoForm({
      title: todo.title,
      content: todo.content || '',
      startDate: todo.startDate || '',
      dueDate: todo.dueDate || ''
    });
    setShowAddModal(true);
  };

  // Handle saving todo (create or update)
  const handleSaveTodo = async () => {
    if (!todoForm.title.trim()) return;

    let result;
    if (editingTodo) {
      // Update existing todo
      result = await updateTodo(editingTodo.todoId, todoForm);
    } else {
      // Create new todo
      result = await useTodoStore.getState().createTodo(todoForm);
    }

    if (result.success) {
      // Refetch todos to ensure UI is up-to-date
      fetchTodos(filter === 'all' ? undefined : filter);
      setTodoForm({ title: '', content: '', startDate: '', dueDate: '' });
      setShowAddModal(false);
      setEditingTodo(null);
    }
  };

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">나의 할일 목록</h1>
        </div>
        <Button
          onClick={() => {
            setEditingTodo(null);
            setTodoForm({ title: '', content: '', startDate: '', dueDate: '' });
            setShowAddModal(true);
          }}
          variant="primary"
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          할일 추가
        </Button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex space-x-2">
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

        <div className="relative flex-1 w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="할일 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="sort-select" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
            정렬:
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="dueDate">만료일</option>
            <option value="createdAt">생성일</option>
          </select>
        </div>
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

      {/* Combined todo and holiday list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allItems.length > 0 ? (
            allItems.map((item) => {
              if (item.isTodo) {
                return (
                  <TodoCard
                    key={item.todoId}
                    todo={item}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
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
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {item.date}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          {item.isRecurring && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded dark:bg-red-800/30 dark:text-red-300">
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
              <div className="text-gray-400 dark:text-gray-500 text-4xl">📝</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">할일이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                첫 할일을 추가해보세요!
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setEditingTodo(null);
                    setTodoForm({ title: '', content: '', startDate: '', dueDate: '' });
                    setShowAddModal(true);
                  }}
                  variant="primary"
                >
                  할일 추가
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          onClick={() => {
            setEditingTodo(null);
            setTodoForm({ title: '', content: '', startDate: '', dueDate: '' });
            setShowAddModal(true);
          }}
          variant="primary"
          size="lg"
          className="!rounded-full !h-14 !w-14 !p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Todo Form Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTodo(null);
        }}
        title={editingTodo ? "할일 수정" : "할일 추가"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              제목 *
            </label>
            <Input
              type="text"
              id="title"
              value={todoForm.title}
              onChange={(e) => setTodoForm({...todoForm, title: e.target.value})}
              placeholder="할일 제목 입력"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              내용
            </label>
            <textarea
              id="content"
              value={todoForm.content}
              onChange={(e) => setTodoForm({...todoForm, content: e.target.value})}
              placeholder="할일 내용 입력 (선택)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                시작일
              </label>
              <Input
                type="date"
                id="startDate"
                value={todoForm.startDate}
                onChange={(e) => setTodoForm({...todoForm, startDate: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                만료일
              </label>
              <Input
                type="date"
                id="dueDate"
                value={todoForm.dueDate}
                onChange={(e) => setTodoForm({...todoForm, dueDate: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setEditingTodo(null);
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveTodo}
            >
              {editingTodo ? '수정' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoListPage;