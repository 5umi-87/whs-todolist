import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import TodoCard from '../components/common/TodoCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const TodoListPage = () => {
  const {
    todos,
    loading,
    error,
    fetchTodos,
    fetchAllTodos,
    toggleComplete,
    deleteTodo,
    updateTodo,
    createTodo,
  } = useTodoStore();
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
    dueDate: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (filter === 'all') {
        fetchAllTodos();
      } else {
        fetchTodos(filter);
      }
    }
  }, [filter, isAuthenticated, fetchTodos, fetchAllTodos]);

  // Filter todos based on selected filter
  const filteredTodos = todos.filter(todo => {
    // For 'all' filter, show all active tasks and completed tasks (regardless of isCompleted flag)
    if (filter === 'all') return todo.status !== 'deleted';
    if (filter === 'active')
      return todo.status === 'active' && !todo.isCompleted;
    if (filter === 'completed')
      return (
        (todo.status === 'active' && todo.isCompleted) ||
        todo.status === 'completed'
      );
    return todo.status === filter;
  });

  // Apply search filter
  const searchedTodos = filteredTodos.filter(
    todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.content &&
        todo.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort by selected option
  const sortedTodos = [...searchedTodos].sort((a, b) => {
    if (sortOption === 'dueDate') {
      const dateA = new Date(a.dueDate || a.startDate || '9999-12-31');
      const dateB = new Date(b.dueDate || b.startDate || '9999-12-31');
      return dateA - dateB;
    } else if (sortOption === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Descending order
    }
    return 0;
  });

  // Handle todo completion
  const handleToggleComplete = async id => {
    const result = await toggleComplete(id);
    if (result.success) {
      // Refetch todos based on current filter to update the list properly
      if (filter === 'all') {
        fetchAllTodos();
      } else {
        fetchTodos(filter);
      }
    }
  };

  // Handle todo deletion
  const handleDeleteTodo = async id => {
    const result = await deleteTodo(id);
    if (result.success) {
      // Deletion handled by store
    }
  };

  // Handle opening edit modal
  const handleEditTodo = todo => {
    setEditingTodo(todo);
    setTodoForm({
      title: todo.title,
      content: todo.content || '',
      startDate: todo.startDate || '',
      dueDate: todo.dueDate || '',
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
      result = await createTodo(todoForm);
    }

    if (result.success) {
      // Refetch todos to ensure UI is up-to-date
      if (filter === 'all') {
        fetchAllTodos();
      } else {
        fetchTodos(filter);
      }
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
      {/* Header: 제목과 할일 추가 버튼 가로 정렬 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text">
          할일 목록
        </h1>
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

      {/* Filter and search bar - 와이어프레임 3.3.1: 한 줄에 가로 배치 */}
      <div className="flex items-center gap-4 bg-background-white dark:bg-dark-surface p-3 rounded border border-border-light dark:border-gray-700 flex-wrap">
        {/* 필터 탭 */}
        <div className="flex space-x-1">
          {['all', 'active', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                filter === tab
                  ? 'bg-primary-light text-primary-main dark:bg-primary-main dark:text-text-white'
                  : 'text-text-secondary dark:text-dark-textSecondary hover:bg-hover-gray dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'all' && '전체'}
              {tab === 'active' && '진행중'}
              {tab === 'completed' && '완료'}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-secondary dark:text-dark-textSecondary" />
          </div>
          <Input
            type="text"
            placeholder="할일 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 w-full text-sm"
          />
        </div>

        {/* 정렬 드롭다운 */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-sm text-text-secondary dark:text-dark-textSecondary whitespace-nowrap"
          >
            정렬
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border border-border-gray dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-background-white dark:bg-dark-surface text-text-primary dark:text-dark-text"
          >
            <option value="dueDate">마감일순</option>
            <option value="createdAt">생성일순</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-active-blue"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="bg-red-50 border border-status-overdue text-status-overdue px-4 py-3 rounded"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Todo list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTodos.length > 0 ? (
            sortedTodos.map(todo => (
              <TodoCard
                key={todo.todoId}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-text-disabled dark:text-gray-500 text-4xl">
                📝
              </div>
              <h3 className="mt-2 text-sm font-medium text-text-primary dark:text-dark-text">
                할일이 없습니다
              </h3>
              <p className="mt-1 text-sm text-text-secondary dark:text-dark-textSecondary">
                새로운 할일을 추가해보세요
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setEditingTodo(null);
                    setTodoForm({
                      title: '',
                      content: '',
                      startDate: '',
                      dueDate: '',
                    });
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
        title={editingTodo ? '할일 수정' : '할일 추가'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-primary dark:text-dark-text mb-1"
            >
              제목
            </label>
            <Input
              type="text"
              id="title"
              value={todoForm.title}
              onChange={e =>
                setTodoForm({ ...todoForm, title: e.target.value })
              }
              placeholder="할일 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-text-primary dark:text-dark-text mb-1"
            >
              내용
            </label>
            <textarea
              id="content"
              value={todoForm.content}
              onChange={e =>
                setTodoForm({ ...todoForm, content: e.target.value })
              }
              placeholder="상세 내용을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-border-gray dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-active-blue focus:border-active-blue dark:bg-dark-surface dark:text-dark-text text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-text-primary dark:text-dark-text mb-1"
              >
                시작일
              </label>
              <Input
                type="date"
                id="startDate"
                value={todoForm.startDate}
                onChange={e =>
                  setTodoForm({ ...todoForm, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-text-primary dark:text-dark-text mb-1"
              >
                마감일
              </label>
              <Input
                type="date"
                id="dueDate"
                value={todoForm.dueDate}
                onChange={e =>
                  setTodoForm({ ...todoForm, dueDate: e.target.value })
                }
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
            <Button type="button" variant="primary" onClick={handleSaveTodo}>
              {editingTodo ? '수정' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoListPage;
